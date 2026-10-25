import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from 'ngx-daisy/button';
import { DsyFormField, DsyHint } from 'ngx-daisy/form-field';
import { DsyOtp } from 'ngx-daisy/otp';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-otp-demo',
  standalone: true,
  imports: [Playground, FormField, ReactiveFormsModule, DsyFormField, DsyHint, DsyButton, DsyOtp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './otp-demo.html',
  styleUrl: './otp-demo.scss',
})
export class OtpDemo {
  readonly playground = playground;
  readonly model = signal<{ value: string | null }>({ value: '' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<string | null>('');
  readonly complete = signal(false);
}
