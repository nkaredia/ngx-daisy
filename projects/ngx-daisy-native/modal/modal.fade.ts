/** Narrow bridge for native dialog transitions; core retains dismissal and completion ownership. */
interface ModalFadeHost {
  viewController?: { modalTransitionStyle: number };
  _dialogFragment?: { getDialog(): { getWindow(): { setWindowAnimations(style: number): void } } };
}
declare const android: { R: { style: { Animation_Toast: number } } };

export function configureModalFade(host: ModalFadeHost, enabled: boolean): void {
  if (host.viewController) {
    host.viewController.modalTransitionStyle = 2; // UIModalTransitionStyle.CrossDissolve
  }
  const window = host._dialogFragment?.getDialog()?.getWindow();
  if (window && typeof android !== 'undefined') {
    // Android's public Animation.Toast style contains alpha-only enter/exit animations.
    window.setWindowAnimations(enabled ? android.R.style.Animation_Toast : 0);
  }
}
