/** Narrow bridge for native dialog transitions; core retains dismissal and completion ownership. */
interface ModalFadeHost {
  viewController?: { modalTransitionStyle: number };
  _dialogFragment?: {
    getDialog(): {
      getWindow(): {
        setWindowAnimations(style: number): void;
        setBackgroundDrawable(drawable: unknown): void;
      };
    };
  };
}
declare const android: {
  R: { style: { Animation_Toast: number } };
  graphics: { drawable: { ColorDrawable: new (color: number) => unknown } };
};

export function configureModalFade(host: ModalFadeHost, enabled: boolean): void {
  if (host.viewController) {
    host.viewController.modalTransitionStyle = 2; // UIModalTransitionStyle.CrossDissolve
  }
  const window = host._dialogFragment?.getDialog()?.getWindow();
  if (window && typeof android !== 'undefined') {
    // The panel owns its themed surface and shadow; the native window must not add a square card behind it.
    window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
    // Android's public Animation.Toast style contains alpha-only enter/exit animations.
    window.setWindowAnimations(enabled ? android.R.style.Animation_Toast : 0);
  }
}
