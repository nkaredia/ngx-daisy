import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from 'ngx-daisy/button';
import { DsyFormField, DsyHint, DsyPrefix } from 'ngx-daisy/form-field';
import { DsyInput, DsyInputWrapper } from 'ngx-daisy/input';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-input-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    ReactiveFormsModule,
    DsyFormField,
    DsyHint,
    DsyPrefix,
    DsyButton,
    DsyInput,
    DsyInputWrapper,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './input-demo.html',
  styleUrl: './input-demo.scss',
})
export class InputDemo {
  readonly playground = playground;
  readonly model = signal({ value: '' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl('', { nonNullable: true });
  readonly disabled = signal(false);
}
