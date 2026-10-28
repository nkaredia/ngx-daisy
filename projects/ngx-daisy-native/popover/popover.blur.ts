import { Application } from '@nativescript/core';

interface NativeBlurView {
  frame: unknown;
  autoresizingMask: number;
  effect: unknown;
  backgroundColor: unknown;
  userInteractionEnabled: boolean;
  isAccessibilityElement: boolean;
  accessibilityElementsHidden: boolean;
  removeFromSuperview(): void;
}
interface NativeBlurHost {
  bounds: unknown;
  insertSubviewAtIndex(view: NativeBlurView, index: number): void;
  sendSubviewToBack(view: NativeBlurView): void;
}
declare const UIVisualEffectView: {
  alloc(): { initWithEffect(effect: unknown): NativeBlurView };
};
declare const UIBlurEffect: { effectWithStyle(style: number): unknown };
declare const UIColor: {
  clearColor: unknown;
  colorWithWhiteAlpha(white: number, alpha: number): unknown;
};
declare function UIAccessibilityIsReduceTransparencyEnabled(): boolean;
declare function UIAccessibilityDarkerSystemColorsEnabled(): boolean;
declare const UIAccessibilityReduceTransparencyStatusDidChangeNotification: string;
declare const UIAccessibilityDarkerSystemColorsStatusDidChangeNotification: string;

/** Internal UIKit backdrop. Its host and effect keep alpha=1; tint belongs on the scrim. */
export function attachPopoverBlur(
  host: NativeBlurHost,
  scheme: 'light' | 'dark',
): {
  layout(): void;
  setScheme(scheme: 'light' | 'dark'): void;
  dispose(): void;
} {
  const effect = UIVisualEffectView.alloc().initWithEffect(null);
  effect.autoresizingMask = 18; // UIViewAutoresizingFlexibleWidth | FlexibleHeight
  effect.userInteractionEnabled = false;
  effect.isAccessibilityElement = false;
  effect.accessibilityElementsHidden = true;
  let disposed = false;
  const update = () => {
    if (disposed) return;
    const solid =
      UIAccessibilityIsReduceTransparencyEnabled() || UIAccessibilityDarkerSystemColorsEnabled();
    // SystemThinMaterialLight / Dark follow the app theme even when it differs
    // from the device appearance. The foreground keeps its opaque theme surface.
    effect.effect = solid ? null : UIBlurEffect.effectWithStyle(scheme === 'dark' ? 17 : 12);
    effect.backgroundColor = solid ? UIColor.colorWithWhiteAlpha(0, 0.45) : UIColor.clearColor;
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
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const { name, observer } of observers)
        Application.ios.removeNotificationObserver(observer, name);
      effect.removeFromSuperview();
    },
  };
}
