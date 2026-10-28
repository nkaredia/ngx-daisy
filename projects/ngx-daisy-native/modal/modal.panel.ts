import { GridLayout, CSSType } from '@nativescript/core';
import { registerElement } from '@nativescript/angular';

let registered = false;
/** Type defaults stay below app utility classes in NativeScript's cascade. */
export function ensureModalPanel(): void {
  if (registered) return;
  registered = true;
  class DsyModalPanel extends GridLayout {}
  CSSType('DsyModalPanel')(DsyModalPanel);
  registerElement('DsyModalPanel', () => DsyModalPanel);
}
