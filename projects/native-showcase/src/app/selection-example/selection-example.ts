import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
  signal,
} from '@angular/core';
import { FormField, form, min, max } from '@angular/forms/signals';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { DsyCheckbox } from '@ngx-daisy/native/checkbox';
import { DsyRadio, DsyRadioGroup } from '@ngx-daisy/native/radio';
import { DsyRange } from '@ngx-daisy/native/range';
import { DsyButton } from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-selection-example',
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    FormField,
    DsyCheckbox,
    DsyRadio,
    DsyRadioGroup,
    DsyRange,
    DsyButton,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './selection-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeSelectionExample {
  readonly family = input<'checkboxes' | 'radios' | 'ranges'>('checkboxes');
  readonly choices = signal({ gift: true, protection: false, delivery: 'standard', budget: 75 });
  readonly fields = form(this.choices, (path) => {
    min(path.budget, 20);
    max(path.budget, 200);
  });
  readonly extrasCount = computed(
    () => Number(this.choices().gift) + Number(this.choices().protection),
  );
  readonly extrasPrice = computed(
    () => (this.choices().gift ? 4 : 0) + (this.choices().protection ? 6 : 0),
  );
  readonly deliveryLabel = computed(() =>
    this.choices().delivery === 'express' ? 'Express delivery · $9' : 'Standard delivery · Free',
  );
  readonly annualGoal = computed(() => (this.choices().budget * 12).toLocaleString('en-US'));
  readonly message = signal('Try a choice to see the summary update.');
  setAll(checked: boolean): void {
    this.choices.update((value) => ({ ...value, gift: checked, protection: checked }));
  }
  adjustBudget(amount: number): void {
    this.choices.update((value) => ({
      ...value,
      budget: Math.min(200, Math.max(20, value.budget + amount)),
    }));
  }
}
