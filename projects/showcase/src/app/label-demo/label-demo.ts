import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { DsyFormField, DsyHint } from 'ngx-daisy/form-field';
import { DsyInput } from 'ngx-daisy/input';
import { DsyFloatingLabel, DsyLabel, DsyNativeLabel } from 'ngx-daisy/label';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-label-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    DsyFormField,
    DsyHint,
    DsyLabel,
    DsyNativeLabel,
    DsyFloatingLabel,
    DsyInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './label-demo.html',
  styleUrl: './label-demo.scss',
})
export class LabelDemo {
  readonly playground = playground;
  readonly model = signal({ name: '', floating: '' });
  readonly fields = form(this.model);
}
