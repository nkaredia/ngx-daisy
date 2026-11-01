export {};
const runtime = vi.hoisted(() => ({
  implementation: undefined as unknown,
  resolve: undefined as unknown,
  notify: vi.fn(),
  insets: undefined as unknown,
  resolvers: new Map<string, () => unknown>(),
}));
vi.mock('@nativescript/core', () => ({
  Application: {
    ios: { addNotificationObserver: vi.fn(), removeNotificationObserver: vi.fn() },
  },
  Color: class {
    get ios() {
      return { colorWithAlphaComponent: (alpha: number) => ({ alpha }) };
    }
  },
  GridLayout: class GridLayout {
    nativeViewProtected = {
      bounds: { width: 280, height: 360 },
      layer: { cornerRadius: 16 },
      insertSubviewAtIndex: vi.fn(),
      sendSubviewToBack: vi.fn(),
    };
    style = { backgroundColor: { a: 0 }, backgroundImage: '', on: vi.fn(), off: vi.fn() };
    onLoaded() {}
    onUnloaded() {}
    onLayout() {}
    disposeNativeView() {}
  },
  CSSType: () => () => {},
  isIOS: true,
  AbsoluteLayout: class {
    notify = runtime.notify;
    nativeViewProtected: unknown;
    getSafeAreaInsets() {
      return { top: 62, bottom: 34, left: 0, right: 0 };
    }
    onLayout() {
      runtime.insets = this.getSafeAreaInsets();
    }
    disposeNativeView() {}
  },
}));
vi.mock('@nativescript/angular', () => ({
  registerElement: (name: string, resolve: () => unknown) => {
    runtime.resolve = resolve;
    runtime.resolvers.set(name, resolve);
  },
}));
it('returns a native NSArray for iOS key commands and releases dismissal callbacks on disposal', async () => {
  const nativeArray = { nativeArray: true };
  const convert = vi.fn(() => nativeArray);
  vi.stubGlobal('NSArray', { arrayWithArray: convert });
  vi.stubGlobal('UIKeyCommand', {
    keyCommandWithInputModifierFlagsAction: () => ({ command: 'escape' }),
  });
  vi.stubGlobal('interop', { types: { void: {} } });
  vi.stubGlobal('UIView', {
    extend: (implementation: object) => {
      runtime.implementation = implementation;
      return { new: () => Object.create(implementation) };
    },
  });
  vi.resetModules();
  const { ensurePopoverLayer } = await import('./popover/popover.layer');
  ensurePopoverLayer();
  type Native = {
    keyCommands: unknown;
    dsyClosePopover(): void;
    accessibilityPerformEscape(): boolean;
  };
  const Constructor = (
    runtime.resolve as () => new () => {
      createNativeView(): Native;
      nativeViewProtected: Native;
      disposeNativeView(): void;
      getSafeAreaInsets(): unknown;
      onLayout(left: number, top: number, right: number, bottom: number): void;
    }
  )();
  const layer = new Constructor();
  const native = layer.createNativeView();
  layer.onLayout(0, 0, 320, 640);
  expect(runtime.insets).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  expect(layer.getSafeAreaInsets()).toEqual({ top: 62, bottom: 34, left: 0, right: 0 });
  layer.nativeViewProtected = native;
  expect(native.keyCommands).toBe(nativeArray);
  expect(convert).toHaveBeenCalledExactlyOnceWith([{ command: 'escape' }]);
  native.dsyClosePopover();
  expect(native.accessibilityPerformEscape()).toBe(true);
  expect(runtime.notify).toHaveBeenCalledTimes(2);
  layer.disposeNativeView();
  native.dsyClosePopover();
  expect(runtime.notify).toHaveBeenCalledTimes(2);
  vi.unstubAllGlobals();
});
it('attaches the material to the panel only and respects explicit app surface backgrounds', async () => {
  const effect = {
    frame: undefined,
    effect: undefined,
    contentView: { backgroundColor: undefined },
    layer: { cornerRadius: 0 },
    hidden: false,
    removeFromSuperview: vi.fn(),
  };
  const allocate = vi.fn(() => ({ initWithEffect: () => effect }));
  vi.stubGlobal('UIVisualEffectView', { alloc: allocate });
  vi.stubGlobal('UIBlurEffect', { effectWithStyle: (style: number) => ({ style }) });
  vi.stubGlobal('UIAccessibilityIsReduceTransparencyEnabled', () => false);
  vi.stubGlobal('UIAccessibilityDarkerSystemColorsEnabled', () => false);
  vi.stubGlobal('UIAccessibilityReduceTransparencyStatusDidChangeNotification', 'transparency');
  vi.stubGlobal('UIAccessibilityDarkerSystemColorsStatusDidChangeNotification', 'contrast');
  vi.resetModules();
  const { ensurePopoverLayer } = await import('./popover/popover.layer');
  ensurePopoverLayer();
  type Panel = {
    nativeViewProtected: { bounds: unknown; insertSubviewAtIndex: ReturnType<typeof vi.fn> };
    materialScheme: string;
    materialColor: string;
    style: {
      backgroundColor: { a: number };
      on: ReturnType<typeof vi.fn>;
      off: ReturnType<typeof vi.fn>;
    };
    onLoaded(): void;
    onUnloaded(): void;
    onLayout(l: number, t: number, r: number, b: number): void;
    disposeNativeView(): void;
  };
  const PanelClass = runtime.resolvers.get('DsyPopoverPanel')!() as new () => Panel;
  const panel = new PanelClass();
  panel.materialScheme = 'dark';
  panel.materialColor = 'navy';
  panel.onLoaded();
  expect(panel.nativeViewProtected.insertSubviewAtIndex).toHaveBeenCalledWith(effect, 0);
  expect(effect.effect).toEqual({ style: 17 });
  expect(effect.hidden).toBe(false);
  const styleChanged = panel.style.on.mock.calls.find(
    ([event]) => event === 'backgroundColorChange',
  )![1] as () => void;
  panel.style.backgroundColor = { a: 255 };
  styleChanged();
  expect(effect.hidden).toBe(true);
  panel.onLayout(0, 0, 280, 360);
  expect(effect.frame).toEqual(panel.nativeViewProtected.bounds);
  panel.onUnloaded();
  panel.disposeNativeView();
  expect(effect.removeFromSuperview).toHaveBeenCalledOnce();
  expect(panel.style.off).toHaveBeenCalledWith('backgroundColorChange', styleChanged);
  expect(panel.style.off).toHaveBeenCalledWith('backgroundImageChange', styleChanged);
  const LayerClass = runtime.resolvers.get('DsyPopoverLayer')!() as new () => {
    onLayout(l: number, t: number, r: number, b: number): void;
  };
  new LayerClass().onLayout(0, 0, 390, 844);
  expect(allocate).toHaveBeenCalledTimes(1);
  vi.unstubAllGlobals();
});
