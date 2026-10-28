const runtime = vi.hoisted(() => ({
  implementation: undefined as unknown,
  resolve: undefined as unknown,
  notify: vi.fn(),
  insets: undefined as unknown,
}));
vi.mock('@nativescript/core', () => ({
  Application: {},
  GridLayout: class GridLayout {},
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
  registerElement: (_name: string, resolve: unknown) => {
    runtime.resolve = resolve;
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
