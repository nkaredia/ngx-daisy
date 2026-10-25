import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-checkbox-demo',
  standalone: true,
  imports: [Playground, FormField, ReactiveFormsModule, DsyButton, DsyCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './checkbox-demo.html',
  styleUrl: './checkbox-demo.scss',
})
export class CheckboxDemo {
  readonly playground = playground;
  readonly model = signal({ value: false });
  readonly fields = form(this.model);
  readonly reactive = new FormControl(false, { nonNullable: true });
  readonly disabled = signal(false);
  readonly colors = [
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ] as const;
}
