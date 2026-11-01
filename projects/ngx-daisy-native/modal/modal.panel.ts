import type { ViewCommon } from '@nativescript/core/ui/core/view/view-common';
import { GridLayout, RootLayout, CSSType } from '@nativescript/core';
import { registerElement } from '@nativescript/angular';

let registered = false;
/** Type defaults stay below app utility classes in NativeScript's cascade. */
export function ensureModalPanel(): void {
  if (registered) return;
  registered = true;
  class DsyModalPanel extends GridLayout {}
  class DsyModalRoot extends RootLayout {
    dismissMotion?: () => Promise<unknown> | undefined;
    private dismissing = false;
    protected override _hideNativeModalView(parent: ViewCommon, whenClosed: () => void): void {
      if (this.dismissing) return;
      this.dismissing = true;
      this.isUserInteractionEnabled = false;
      this.accessibilityHidden = true;
      // Keep the dialog mounted while its panel exits; native dismissal still owns completion.
      void finishModalPanelExit(this.dismissMotion, () =>
        super._hideNativeModalView(parent, whenClosed),
      );
    }
  }
  CSSType('RootLayout')(DsyModalRoot);
  registerElement('DsyModalRoot', () => DsyModalRoot);
  CSSType('DsyModalPanel')(DsyModalPanel);
  registerElement('DsyModalPanel', () => DsyModalPanel);
}

/** Rendering failures must never prevent native dismissal or overwrite its result. */
export async function finishModalPanelExit(
  animate: (() => Promise<unknown> | undefined) | undefined,
  dismiss: () => void,
): Promise<void> {
  try {
    await animate?.();
  } catch {
    /* Native dismissal must remain available. */
  } finally {
    dismiss();
  }
}
