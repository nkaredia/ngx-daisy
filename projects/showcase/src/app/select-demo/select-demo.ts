import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from 'ngx-daisy/button';
import { DsyFormField, DsyHint } from 'ngx-daisy/form-field';
import { DsySelect, DsySelectWrapper } from 'ngx-daisy/select';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-select-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    ReactiveFormsModule,
    DsyFormField,
    DsyHint,
    DsyButton,
    DsySelect,
    DsySelectWrapper,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './select-demo.html',
  styleUrl: './select-demo.scss',
})
export class SelectDemo {
  readonly playground = playground;
  readonly model = signal({ value: 'angular' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl('angular', { nonNullable: true });
  readonly disabled = signal(false);
}
