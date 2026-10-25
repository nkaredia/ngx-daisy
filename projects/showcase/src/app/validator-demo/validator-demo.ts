import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { email, form, FormField, required } from '@angular/forms/signals';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyError, DsyFormField, DsyHint } from '@ngx-daisy/cdk/form-field';
import { DsyInput } from '@ngx-daisy/cdk/input';
import { DsyValidator } from '@ngx-daisy/cdk/validator';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-validator-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    ReactiveFormsModule,

    DsyFormField,
    DsyHint,
    DsyError,

    DsyButton,
    DsyInput,
    DsyValidator,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './validator-demo.html',
  styleUrl: './validator-demo.scss',
})
export class ValidatorDemo {
  readonly playground = playground;
  readonly model = signal({ email: '' });
  readonly fields = form(this.model, (s) => {
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Enter a valid email' });
  });
  readonly reactive = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
