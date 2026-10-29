import { DestroyRef, Directive, ElementRef, effect, inject, input, signal } from '@angular/core';
import { isIOS, type View } from '@nativescript/core';
import {
  DSY_MOTION_CONFIG,
  DsyMotionController,
  nativeMotionEnabled,
} from '@ngx-daisy/native/motion';

import { animateSidebarSnapshot } from './sidebar-snapshot';

/** Animate the iOS presentation without transforming the live, frame-laid-out controls. */
@Directive({
  selector: '[appSidebarMotion]',
  standalone: true,
  exportAs: 'appSidebarMotion',
  host: {
    '[attr.visibility]': 'retained() ? "visible" : "collapse"',
    '[attr.isUserInteractionEnabled]': 'appSidebarMotion()',
    '[attr.accessibilityHidden]': '!appSidebarMotion()',
  },
})
export class NativeSidebarMotion {
  readonly appSidebarMotion = input.required<boolean>();
  readonly retained = signal(false);
  private readonly view = inject<ElementRef<View>>(ElementRef).nativeElement;
  private readonly config = inject(DSY_MOTION_CONFIG);
  private readonly motion = new DsyMotionController(this.view, this.config);
  private readonly loaded = signal(this.view.isLoaded);
  private stopSnapshot?: () => void;
  private generation = 0;
  private previous = false;

  constructor() {
    const loaded = () => this.loaded.set(true);
    const unloaded = () => {
      this.cancel();
      this.loaded.set(false);
    };
    this.view.on('loaded', loaded);
    this.view.on('unloaded', unloaded);
    effect(() => {
      const opened = this.appSidebarMotion();
      const ready = this.loaded();
      this.cancel();
      const generation = this.generation;
      if (!ready) {
        this.retained.set(opened);
        this.previous = false;
        return;
      }
      if (opened) {
        this.retained.set(true);
        this.view.visibility = 'visible';
        if (isIOS) this.view.opacity = 0;
        else {
          this.view.opacity = 1;
          if (!this.previous) this.view.translateX = -288;
        }
      } else if (!this.previous) {
        this.retained.set(false);
        return;
      }
      this.previous = opened;
      const finish = () => {
        if (generation !== this.generation) return;
        this.view.opacity = 1;
        this.retained.set(opened);
      };
      if (!nativeMotionEnabled(this.config)) {
        this.view.translateX = 0;
        finish();
        return;
      }
      if (!isIOS) {
        void this.motion
          .to({ opacity: 1, translate: { x: opened ? 0 : -288, y: 0 } }, opened ? 180 : 120)
          .then(finish);
        return;
      }
      this.stopSnapshot = animateSidebarSnapshot(
        this.view,
        opened,
        (opened ? 0.18 : 0.12) * Math.max(0, Math.min(4, this.config.durationScale ?? 1)),
        finish,
      );
    });
    inject(DestroyRef).onDestroy(() => {
      this.cancel();
      this.view.off('loaded', loaded);
      this.view.off('unloaded', unloaded);
    });
  }
  private cancel(): void {
    this.generation++;
    this.motion.cancel();
    this.stopSnapshot?.();
    this.stopSnapshot = undefined;
    this.view.opacity = 1;
  }
}
