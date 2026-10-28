import {
  DestroyRef,
  ElementRef,
  InjectionToken,
  Directive,
  input,
  signal,
  untracked,
  effect,
  inject,
} from '@angular/core';
import { Utils, isIOS } from '@nativescript/core';
import type { Animation, AnimationDefinition, EventData, View } from '@nativescript/core';

declare function UIAccessibilityIsReduceMotionEnabled(): boolean;
declare const android: {
  animation: { ValueAnimator: { areAnimatorsEnabled(): boolean } };
  provider: {
    Settings: { Global: { getFloat(resolver: unknown, name: string, fallback: number): number } };
  };
};

export interface DsyMotionConfig {
  readonly enabled?: boolean;
  readonly durationScale?: number;
}
/** App-level opt-out or speed adjustment. System accessibility preferences always win. */
export const DSY_MOTION_CONFIG = new InjectionToken<DsyMotionConfig>('DSY_MOTION_CONFIG', {
  providedIn: 'root',
  factory: () => ({}),
});
export function nativeMotionEnabled(config: DsyMotionConfig = {}): boolean {
  if (config.enabled === false || config.durationScale === 0) return false;
  if (isIOS)
    return (
      typeof UIAccessibilityIsReduceMotionEnabled !== 'function' ||
      !UIAccessibilityIsReduceMotionEnabled()
    );
  if (typeof android !== 'undefined') {
    if (!android.animation.ValueAnimator.areAnimatorsEnabled()) return false;
    const resolver = Utils.android.getApplicationContext().getContentResolver();
    return android.provider.Settings.Global.getFloat(resolver, 'animator_duration_scale', 1) > 0;
  }
  return false; // Non-native test renderers have no animation engine.
}
/** One animation owner per visual; replacement and unload cancel pending work. */
export class DsyMotionController {
  private active?: Animation;
  private generation = 0;
  constructor(
    private readonly view: View,
    private readonly config: DsyMotionConfig = {},
  ) {}
  cancel(): void {
    this.generation++;
    const active = this.active;
    this.active = undefined;
    if (active?.isPlaying) active.cancel();
  }
  async to(
    target: Pick<AnimationDefinition, 'opacity' | 'scale' | 'translate'>,
    duration = 160,
  ): Promise<boolean> {
    this.cancel();
    const generation = this.generation;
    if (!this.view.isLoaded || !nativeMotionEnabled(this.config)) {
      if (target.opacity !== undefined) this.view.opacity = target.opacity;
      if (target.scale) {
        this.view.scaleX = target.scale.x;
        this.view.scaleY = target.scale.y;
      }
      if (target.translate) {
        this.view.translateX = target.translate.x;
        this.view.translateY = target.translate.y;
      }
      return true;
    }
    const scale = Math.max(0, Math.min(4, this.config.durationScale ?? 1));
    try {
      const animation = this.view.createAnimation({
        ...target,
        duration: duration * scale,
        curve: 'easeOut',
      });
      this.active = animation;
      await animation.play();
    } catch {
      if (generation !== this.generation) return false;
      // A rendering failure must not leave an invisible panel or shrunken control.
      if (target.opacity !== undefined) this.view.opacity = target.opacity;
      if (target.scale) {
        this.view.scaleX = target.scale.x;
        this.view.scaleY = target.scale.y;
      }
      if (target.translate) {
        this.view.translateX = target.translate.x;
        this.view.translateY = target.translate.y;
      }
    }
    if (generation !== this.generation) return false;
    this.active = undefined;
    return true;
  }
}

/** Internal shared feedback, preserving native control semantics and immediate model updates. */
export function bindNativeFeedback(
  state?: () => unknown,
  enabled: () => boolean = () => true,
): void {
  const view = inject<ElementRef<View>>(ElementRef).nativeElement;
  const motion = new DsyMotionController(view, inject(DSY_MOTION_CONFIG));
  if (typeof view.on !== 'function') return;
  const baseline = { x: view.scaleX ?? 1, y: view.scaleY ?? 1 };
  let pressed = false;
  let previous: unknown;
  let initialized = false;
  const reset = () => {
    motion.cancel();
    view.scaleX = baseline.x;
    view.scaleY = baseline.y;
    pressed = false;
  };
  const touch = (raw: EventData) => {
    const event = raw as EventData & { action?: string };
    if (event.action === 'down' && enabled() && nativeMotionEnabled(injectConfig)) {
      if (!pressed) {
        motion.cancel();
        view.scaleX = baseline.x;
        view.scaleY = baseline.y;
      }
      pressed = true;
      void motion.to({ scale: { x: baseline.x * 0.96, y: baseline.y * 0.96 } }, 80);
    } else if (pressed && (event.action === 'up' || event.action === 'cancel')) {
      pressed = false;
      void motion.to({ scale: baseline }, 140);
    }
  };
  const injectConfig = inject(DSY_MOTION_CONFIG);
  view.on('touch', touch);
  view.on('unloaded', reset);
  effect(() => {
    const next = state?.();
    const available = enabled();
    if (
      state &&
      initialized &&
      next !== previous &&
      available &&
      view.isLoaded &&
      !pressed &&
      nativeMotionEnabled(injectConfig)
    ) {
      motion.cancel();
      view.scaleX = baseline.x * 0.94;
      view.scaleY = baseline.y * 0.94;
      void motion.to({ scale: baseline }, 160);
    }
    previous = next;
    initialized = true;
    if (!available && pressed) reset();
  });
  inject(DestroyRef).onDestroy(() => {
    reset();
    view.off('touch', touch);
    view.off('unloaded', reset);
  });
}

/** Retain a closing view until its exit finishes; stale completions cannot hide a reopened view. */
export function bindNativePresence(
  visible: () => boolean,
  fromX: () => number = () => 0,
  fromY: () => number = () => 8,
): () => boolean {
  const view = inject<ElementRef<View>>(ElementRef).nativeElement;
  const motion = new DsyMotionController(view, inject(DSY_MOTION_CONFIG));
  const retained = signal(false);
  const loaded = signal(Boolean(view.isLoaded));
  let generation = 0;
  let previous = false;
  const onLoaded = () => loaded.set(true);
  const onUnloaded = () => {
    generation++;
    motion.cancel();
    loaded.set(false);
  };
  if (typeof view.on === 'function') {
    view.on('loaded', onLoaded);
    view.on('unloaded', onUnloaded);
  }
  effect(() => {
    const shown = visible();
    const ready = loaded();
    const offset = fromX();
    const verticalOffset = fromY();
    const current = ++generation;
    motion.cancel();
    if (!ready) {
      retained.set(shown);
      previous = false;
      return;
    }
    if (shown) {
      const wasRetained = untracked(retained);
      retained.set(true);
      view.visibility = 'visible';
      if (!previous && !wasRetained) {
        view.opacity = 0;
        view.translateX = offset;
        view.translateY = verticalOffset;
      }
      void motion.to({ opacity: 1, translate: { x: 0, y: 0 } }, 180);
    } else if (previous) {
      void motion
        .to({ opacity: 0, translate: { x: offset, y: verticalOffset } }, 120)
        .then((finished) => {
          if (finished && generation === current) retained.set(false);
        });
    } else retained.set(false);
    previous = shown;
  });
  inject(DestroyRef).onDestroy(() => {
    onUnloaded();
    if (typeof view.off === 'function') {
      view.off('loaded', onLoaded);
      view.off('unloaded', onUnloaded);
    }
  });
  return retained.asReadonly();
}

@Directive({
  selector: '[dsyMotionVisible]',
  standalone: true,
  host: {
    '[attr.visibility]': 'retained() ? "visible" : "collapse"',
    '[attr.isUserInteractionEnabled]': 'dsyMotionVisible()',
    '[attr.accessibilityHidden]': '!dsyMotionVisible()',
  },
})
export class DsyMotionPresence {
  readonly dsyMotionVisible = input.required<boolean>();
  readonly motionFromX = input(0);
  readonly motionFromY = input(0);
  readonly retained = bindNativePresence(
    () => this.dsyMotionVisible(),
    () => this.motionFromX(),
    () => this.motionFromY(),
  );
}
