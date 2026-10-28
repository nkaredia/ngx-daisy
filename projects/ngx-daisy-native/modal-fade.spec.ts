import { configureModalFade } from './modal/modal.fade';

afterEach(() => vi.unstubAllGlobals());
it('uses cross dissolve for both iOS presentation and dismissal without moving the dialog', () => {
  const host = { viewController: { modalTransitionStyle: 0 } };
  configureModalFade(host, true);
  expect(host.viewController.modalTransitionStyle).toBe(2);
});
it('uses Android alpha-only window animations while preserving native dismissal ownership', () => {
  class ColorDrawable {
    constructor(readonly color: number) {}
  }
  vi.stubGlobal('android', {
    R: { style: { Animation_Toast: 16973828 } },
    graphics: { drawable: { ColorDrawable } },
  });
  const setWindowAnimations = vi.fn();
  const setBackgroundDrawable = vi.fn();
  const host = {
    _dialogFragment: {
      getDialog: () => ({ getWindow: () => ({ setWindowAnimations, setBackgroundDrawable }) }),
    },
  };
  configureModalFade(host, true);
  expect(setWindowAnimations).toHaveBeenCalledWith(16973828);
  expect(setBackgroundDrawable).toHaveBeenCalledWith(expect.objectContaining({ color: 0 }));
  configureModalFade(host, false);
  expect(setWindowAnimations).toHaveBeenLastCalledWith(0);
});
it('waits safely for the native controller or dialog window to exist', () => {
  expect(() => configureModalFade({}, true)).not.toThrow();
});
