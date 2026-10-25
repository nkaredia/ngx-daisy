import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from 'ngx-daisy/button';
import { DsyToggle } from 'ngx-daisy/toggle';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-toggle-demo',
  standalone: true,
  imports: [Playground, FormField, ReactiveFormsModule, DsyButton, DsyToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './toggle-demo.html',
  styleUrl: './toggle-demo.scss',
})
export class ToggleDemo {
  readonly playground = playground;
  readonly model = signal({ value: true });
  readonly fields = form(this.model);
  readonly reactive = new FormControl(true, { nonNullable: true });
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
