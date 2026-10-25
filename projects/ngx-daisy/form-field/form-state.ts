import { afterEveryRender, computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators } from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import { Subscription } from 'rxjs';
export interface DsyFormState {
  invalid: boolean;
  touched: boolean;
  dirty: boolean;
  pending: boolean;
  disabled: boolean;
  required: boolean;
  submitted: boolean;
  bound: boolean;
}
@Injectable({ providedIn: 'root' })
export class DsyErrorStateMatcher {
  isErrorState(state: DsyFormState): boolean {
    return state.invalid && !state.disabled && (state.touched || state.submitted);
  }
}
/** Subscribe to control events as well as signals, including programmatic touch/reset/disable. */
export function injectDsyFormState(fallback: () => Partial<DsyFormState> = () => ({})) {
  const ng = inject(NgControl, { optional: true, self: true });
  const field = inject(FormField, { optional: true, self: true });
  const parent =
    inject(FormGroupDirective, { optional: true, skipSelf: true }) ??
    inject(NgForm, { optional: true, skipSelf: true });
  const revision = signal(0);
  let control: unknown;
  let parentControl: unknown;
  let subscription = new Subscription();
  afterEveryRender(() => {
    if (control === ng?.control && parentControl === parent?.control) return;
    subscription.unsubscribe();
    subscription = new Subscription();
    control = ng?.control;
    parentControl = parent?.control;
    if (!field && ng?.control?.events)
      subscription.add(ng.control.events.subscribe(() => revision.update((v) => v + 1)));
    if (parent?.control)
      subscription.add(parent.control.events.subscribe(() => revision.update((v) => v + 1)));
    revision.update((v) => v + 1);
  });
  inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  return computed<DsyFormState>(() => {
    revision();
    const local = fallback();
    const state = field?.state();
    const c = ng?.control;
    return {
      invalid: state?.invalid() ?? c?.invalid ?? local.invalid ?? false,
      touched: state?.touched() ?? c?.touched ?? local.touched ?? false,
      dirty: state?.dirty() ?? c?.dirty ?? local.dirty ?? false,
      pending: state?.pending() ?? c?.pending ?? local.pending ?? false,
      disabled: state?.disabled() ?? c?.disabled ?? local.disabled ?? false,
      required:
        state?.required() ?? c?.hasValidator(Validators.required) ?? local.required ?? false,
      submitted: parent?.submitted ?? local.submitted ?? false,
      bound: !!(state || c),
    };
  });
}
