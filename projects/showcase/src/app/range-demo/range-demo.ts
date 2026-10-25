import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField, max, min } from '@angular/forms/signals';
import { DsyButton } from 'ngx-daisy/button';
import { DsyFormField, DsyHint } from 'ngx-daisy/form-field';
import { DsyRange } from 'ngx-daisy/range';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-range-demo',
  standalone: true,
  imports: [Playground, FormField, ReactiveFormsModule, DsyFormField, DsyHint, DsyButton, DsyRange],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './range-demo.html',
  styleUrl: './range-demo.scss',
})
export class RangeDemo {
  readonly playground = playground;
  readonly model = signal({ value: 35 });
  readonly fields = form(this.model, (s) => {
    min(s.value, 0);
    max(s.value, 100);
  });
  readonly reactive = new FormControl(35, { nonNullable: true });
  readonly disabled = signal(false);
}
