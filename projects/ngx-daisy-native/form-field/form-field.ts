import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  contentChildren,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { DSY_NATIVE_FIELD, type DsyNativeFieldContext } from './field-context';
/** Labels, helper/error text and native focus for one projected Signal Forms binding. */
@Component({
  selector: 'StackLayout[dsyFormField]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  providers: [{ provide: DSY_NATIVE_FIELD, useExisting: forwardRef(() => DsyFormField) }],
  template: `
    @if (label()) {
      <Label
        [text]="label() + (state()?.required() ? ' *' : '')"
        class="dsy-native-field-label"
        textWrap="true"
        (tap)="focus()"
      ></Label>
    }
    <ng-content />
    @if (description()) {
      <Label
        [text]="description()"
        class="dsy-native-field-message"
        [class.dsy-native-field-error]="showError()"
        textWrap="true"
        accessibilityLiveRegion="polite"
      ></Label>
    }
  `,
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dsy-native-form-field',
    '[visibility]': 'state()?.hidden() ? "collapsed" : "visible"',
  },
})
export class DsyFormField implements DsyNativeFieldContext {
  readonly label = input('');
  readonly hint = input('');
  /** Optional explicit error for controls used without FormField. */
  readonly error = input('');
  readonly errorFallback = input('Check this field.');
  private readonly bindings = contentChildren(FormField, { descendants: true });
  readonly state = computed(() => this.bindings()[0]?.state());
  readonly showError = computed(
    () => !!this.error() || !!(this.state()?.invalid() && this.state()?.touched()),
  );
  readonly description = computed(() =>
    this.showError()
      ? this.error() || this.state()?.errors()[0]?.message || this.errorFallback()
      : this.hint(),
  );
  constructor() {
    effect(() => {
      if (this.bindings().length > 1)
        throw new Error(
          'dsyFormField supports one form binding. Use a separate wrapper for each field.',
        );
    });
  }
  focus(): void {
    this.state()?.focusBoundControl();
  }
}
