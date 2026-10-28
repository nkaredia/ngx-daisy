import { Application, Color } from '@nativescript/core';

interface NativeBlurView {
  frame: unknown;
  autoresizingMask: number;
  effect: unknown;
  contentView: { backgroundColor: unknown };
  hidden: boolean;
  clipsToBounds: boolean;
  layer: { cornerRadius: number };
  userInteractionEnabled: boolean;
  isAccessibilityElement: boolean;
  accessibilityElementsHidden: boolean;
  removeFromSuperview(): void;
}
interface NativeBlurHost {
  bounds: unknown;
  layer: { cornerRadius: number };
  insertSubviewAtIndex(view: NativeBlurView, index: number): void;
  sendSubviewToBack(view: NativeBlurView): void;
}
declare const UIVisualEffectView: {
  alloc(): { initWithEffect(effect: unknown): NativeBlurView };
};
declare const UIBlurEffect: { effectWithStyle(style: number): unknown };
declare function UIAccessibilityIsReduceTransparencyEnabled(): boolean;
declare function UIAccessibilityDarkerSystemColorsEnabled(): boolean;
declare const UIAccessibilityReduceTransparencyStatusDidChangeNotification: string;
declare const UIAccessibilityDarkerSystemColorsStatusDidChangeNotification: string;

/** A decorative material inside the panel bounds, beneath its sharp content. */
export function attachPopoverBlur(
  host: NativeBlurHost,
  scheme: 'light' | 'dark',
  surfaceColor: string,
): {
  layout(): void;
  setScheme(scheme: 'light' | 'dark'): void;
  setSurfaceColor(color: string): void;
  setCovered(covered: boolean): void;
  dispose(): void;
} {
  const effect = UIVisualEffectView.alloc().initWithEffect(null);
  effect.autoresizingMask = 18; // UIViewAutoresizingFlexibleWidth | FlexibleHeight
  effect.userInteractionEnabled = false;
  effect.isAccessibilityElement = false;
  effect.accessibilityElementsHidden = true;
  effect.clipsToBounds = true;
  let disposed = false;
  const update = () => {
    if (disposed) return;
    const solid =
      UIAccessibilityIsReduceTransparencyEnabled() || UIAccessibilityDarkerSystemColorsEnabled();
    // Keep the material themed; stronger accessibility preferences replace it
    // with an opaque theme surface rather than a translucent scrim.
    effect.effect = solid ? null : UIBlurEffect.effectWithStyle(scheme === 'dark' ? 17 : 12);
    effect.contentView.backgroundColor = new Color(surfaceColor).ios.colorWithAlphaComponent(
      solid ? 1 : 0.15,
    );
  };
  const notifications = [
    UIAccessibilityReduceTransparencyStatusDidChangeNotification,
    UIAccessibilityDarkerSystemColorsStatusDidChangeNotification,
  ];
  const observers = notifications.map((name) => ({
    name,
    observer: Application.ios.addNotificationObserver(name, update),
  }));
  host.insertSubviewAtIndex(effect, 0);
  const layout = () => {
    if (disposed) return;
    effect.frame = host.bounds;
    effect.layer.cornerRadius = host.layer.cornerRadius;
    // NativeScript can insert/reorder children after initNativeView.
    host.sendSubviewToBack(effect);
  };
  update();
  layout();
  return {
    layout,
    setScheme(next) {
      if (next === scheme) return;
      scheme = next;
      update();
    },
    setSurfaceColor(next) {
      if (next === surfaceColor) return;
      surfaceColor = next;
      update();
    },
    setCovered(covered) {
      if (!disposed) effect.hidden = covered;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const { name, observer } of observers)
        Application.ios.removeNotificationObserver(observer, name);
      effect.removeFromSuperview();
    },
  };
}
