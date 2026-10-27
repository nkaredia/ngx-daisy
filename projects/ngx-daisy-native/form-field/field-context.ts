import { InjectionToken, type Signal } from '@angular/core';
/** Read-only presentation context. Angular Signal Forms remains the state owner. */
export interface DsyNativeFieldContext {
  readonly label: Signal<string>;
  readonly description: Signal<string>;
}
export const DSY_NATIVE_FIELD = new InjectionToken<DsyNativeFieldContext>('DsyNativeField');
