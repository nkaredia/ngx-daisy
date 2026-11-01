export {};
const runtime = vi.hoisted(() => ({ elements: new Map<string, () => unknown>(), hide: vi.fn() }));
vi.mock('@nativescript/core', () => ({
  GridLayout: class {},
  RootLayout: class {
    _hideNativeModalView(parent: unknown, callback: () => void) {
      runtime.hide(parent, callback);
    }
  },
  CSSType: () => () => {},
}));
vi.mock('@nativescript/angular', () => ({
  registerElement: (name: string, factory: () => unknown) => runtime.elements.set(name, factory),
}));
it('keeps the modal mounted until the panel finishes shrinking, then dismisses once', async () => {
  vi.resetModules();
  const { ensureModalPanel } = await import('./modal/modal.panel');
  ensureModalPanel();
  const Root = runtime.elements.get('DsyModalRoot')!() as new () => {
    dismissMotion: () => Promise<void>;
    _hideNativeModalView(parent: unknown, callback: () => void): void;
    isUserInteractionEnabled: boolean;
    accessibilityHidden: boolean;
  };
  const root = new Root();
  let finish!: () => void;
  root.dismissMotion = () =>
    new Promise<void>((resolve) => {
      finish = resolve;
    });
  const parent = {};
  const completion = vi.fn();
  root._hideNativeModalView(parent, completion);
  root._hideNativeModalView(parent, completion);
  expect(root.isUserInteractionEnabled).toBe(false);
  expect(root.accessibilityHidden).toBe(true);
  expect(runtime.hide).not.toHaveBeenCalled();
  finish();
  await Promise.resolve();
  await Promise.resolve();
  expect(runtime.hide).toHaveBeenCalledExactlyOnceWith(parent, completion);
});
it('preserves native dismissal when panel animation fails or is unavailable', async () => {
  vi.resetModules();
  const { finishModalPanelExit } = await import('./modal/modal.panel');
  const dismiss = vi.fn();
  await finishModalPanelExit(() => Promise.reject(new Error('unloaded')), dismiss);
  expect(dismiss).toHaveBeenCalledOnce();
  await finishModalPanelExit(undefined, dismiss);
  expect(dismiss).toHaveBeenCalledTimes(2);
});
