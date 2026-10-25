import { InjectionToken, Signal } from '@angular/core';
export interface DsyFieldControl {
  readonly controlId: Signal<string>;
  readonly errorState: Signal<boolean>;
  readonly isRequired: Signal<boolean>;
  readonly isDisabled: Signal<boolean>;
  readonly focused: Signal<boolean>;
  setLabelledById?(id: string | null): void;
  focus(options?: FocusOptions): void;
  setDescribedByIds(ids: string[]): void;
}
export const DSY_FIELD_CONTROL = new InjectionToken<DsyFieldControl>('DsyFieldControl');
