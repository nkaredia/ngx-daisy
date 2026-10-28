import { AbsoluteLayout, GridLayout, CSSType, isIOS } from '@nativescript/core';
import { registerElement } from '@nativescript/angular';
import { attachPopoverBlur } from './popover.blur';
interface NativeLayer {
  becomeFirstResponder(): boolean;
}
interface LayerFactory {
  new: () => NativeLayer;
  extend(methods: object, options: object): LayerFactory;
}
declare const UIView: LayerFactory;
declare const NSArray: { arrayWithArray(items: readonly unknown[]): unknown };
declare const UIKeyCommand: {
  keyCommandWithInputModifierFlagsAction(input: string, modifiers: number, action: string): unknown;
};
declare const interop: { types: { void: unknown } };
declare const android: {
  view: {
    View: {
      OnKeyListener: new (implementation: {
        onKey(view: unknown, code: number, event: { getAction(): number }): boolean;
      }) => unknown;
    };
  };
};
const owners = new WeakMap<object, () => void>();
let factory: LayerFactory | undefined;
let registered = false;
/** A native responder ancestor lets Escape reach the popover even from a text field. */
export function ensurePopoverLayer(): void {
  if (registered) return;
  registered = true;
  class DsyPopoverPanel extends GridLayout {
    private blur?: ReturnType<typeof attachPopoverBlur>;
    private scheme: 'light' | 'dark' = 'light';
    private surfaceColor = 'white';
    set materialScheme(value: 'light' | 'dark') {
      this.scheme = value;
      this.blur?.setScheme(value);
    }
    set materialColor(value: string) {
      this.surfaceColor = value;
      this.blur?.setSurfaceColor(value);
    }
    private readonly refreshMaterial = () => {
      // Explicit app backgrounds remain authoritative, including utility classes.
      this.blur?.setCovered(!!this.style.backgroundColor?.a || !!this.style.backgroundImage);
    };
    override onLoaded(): void {
      super.onLoaded();
      if (isIOS) {
        this.blur = attachPopoverBlur(this.nativeViewProtected, this.scheme, this.surfaceColor);
        this.style.on('backgroundColorChange', this.refreshMaterial);
        this.style.on('backgroundImageChange', this.refreshMaterial);
        this.refreshMaterial();
      }
    }
    override onUnloaded(): void {
      this.blur?.dispose();
      this.blur = undefined;
      this.style.off('backgroundColorChange', this.refreshMaterial);
      this.style.off('backgroundImageChange', this.refreshMaterial);
      super.onUnloaded();
    }
    override onLayout(left: number, top: number, right: number, bottom: number): void {
      super.onLayout(left, top, right, bottom);
      this.blur?.layout();
    }
    override disposeNativeView(): void {
      this.blur?.dispose();
      this.blur = undefined;
      this.style.off('backgroundColorChange', this.refreshMaterial);
      this.style.off('backgroundImageChange', this.refreshMaterial);
      super.disposeNativeView();
    }
  }
  CSSType(isIOS ? 'DsyPopoverMaterialPanel' : 'DsyPopoverPanel')(DsyPopoverPanel);
  registerElement('DsyPopoverPanel', () => DsyPopoverPanel);
  class DsyPopoverLayer extends AbsoluteLayout {
    private positioningChildren = false;
    override getSafeAreaInsets(): ReturnType<AbsoluteLayout['getSafeAreaInsets']> {
      // Anchors already use this view's local coordinates. Keep safe-area handling
      // for the layer's frame, without AbsoluteLayout offsetting its children again.
      return this.positioningChildren
        ? { top: 0, right: 0, bottom: 0, left: 0 }
        : super.getSafeAreaInsets();
    }
    override onLayout(left: number, top: number, right: number, bottom: number): void {
      this.positioningChildren = true;
      try {
        super.onLayout(left, top, right, bottom);
      } finally {
        this.positioningChildren = false;
      }
    }
    override createNativeView(): ReturnType<AbsoluteLayout['createNativeView']> {
      if (!isIOS) return super.createNativeView();
      factory ??= UIView.extend(
        {
          get canBecomeFirstResponder() {
            return true;
          },
          get keyCommands() {
            return NSArray.arrayWithArray([
              UIKeyCommand.keyCommandWithInputModifierFlagsAction('\u001b', 0, 'dsyClosePopover'),
            ]);
          },
          dsyClosePopover(this: object) {
            owners.get(this)?.();
          },
          accessibilityPerformEscape(this: object) {
            owners.get(this)?.();
            return true;
          },
        },
        {
          name: 'DsyPopoverResponder',
          exposedMethods: { dsyClosePopover: { returns: interop.types.void, params: [] } },
        },
      );
      const view = factory.new();
      owners.set(view, () => this.notify({ eventName: 'dismissRequest', object: this }));
      return view;
    }
    override initNativeView(): void {
      super.initNativeView();
      if (!isIOS) {
        this.nativeViewProtected.setFocusableInTouchMode(true);
        this.nativeViewProtected.setOnKeyListener(
          new android.view.View.OnKeyListener({
            onKey: (_view, code, event) => {
              if (code !== 111) return false;
              if (event.getAction() === 1)
                this.notify({ eventName: 'dismissRequest', object: this });
              return true;
            },
          }),
        );
      }
    }
    override disposeNativeView(): void {
      if (isIOS) owners.delete(this.nativeViewProtected);
      else this.nativeViewProtected.setOnKeyListener(null);
      super.disposeNativeView();
    }
  }
  registerElement('DsyPopoverLayer', () => DsyPopoverLayer);
}
