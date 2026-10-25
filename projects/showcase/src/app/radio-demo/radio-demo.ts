import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from 'ngx-daisy/button';
import { DsyFormField, DsyHint } from 'ngx-daisy/form-field';
import { DsyRadioButton, DsyRadioGroup } from 'ngx-daisy/radio';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-radio-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    ReactiveFormsModule,

    DsyFormField,
    DsyHint,

    DsyButton,
    DsyRadioGroup,
    DsyRadioButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './radio-demo.html',
  styleUrl: './radio-demo.scss',
})
export class RadioDemo {
  readonly playground = playground;
  readonly model = signal({ value: 'email' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<string | null>('sms');
}
