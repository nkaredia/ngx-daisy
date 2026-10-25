import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { DsyCheckbox } from 'ngx-daisy/checkbox';
import { DsyFieldset, DsyLegend, DsyFieldsetLabel } from 'ngx-daisy/fieldset';
import { DsyFormField } from 'ngx-daisy/form-field';
import { DsyInput } from 'ngx-daisy/input';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-fieldset-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    DsyFormField,
    DsyFieldset,
    DsyLegend,
    DsyFieldsetLabel,
    DsyInput,
    DsyCheckbox,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fieldset-demo.html',
  styleUrl: './fieldset-demo.scss',
})
export class FieldsetDemo {
  readonly playground = playground;
  readonly model = signal({ name: 'Workspace', updates: true });
  readonly fields = form(this.model);
  readonly locked = signal(false);
}
