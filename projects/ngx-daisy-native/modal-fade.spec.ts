import { configureModalFade } from './modal/modal.fade';

afterEach(() => vi.unstubAllGlobals());
it('uses cross dissolve for both iOS presentation and dismissal without moving the dialog', () => {
  const host = { viewController: { modalTransitionStyle: 0 } };
  configureModalFade(host, true);
  expect(host.viewController.modalTransitionStyle).toBe(2);
});
it('uses Android alpha-only window animations while preserving native dismissal ownership', () => {
  vi.stubGlobal('android', { R: { style: { Animation_Toast: 16973828 } } });
  const setWindowAnimations = vi.fn();
  const host = {
    _dialogFragment: { getDialog: () => ({ getWindow: () => ({ setWindowAnimations }) }) },
  };
  configureModalFade(host, true);
  expect(setWindowAnimations).toHaveBeenCalledWith(16973828);
  configureModalFade(host, false);
  expect(setWindowAnimations).toHaveBeenLastCalledWith(0);
});
it('waits safely for the native controller or dialog window to exist', () => {
  expect(() => configureModalFade({}, true)).not.toThrow();
});
