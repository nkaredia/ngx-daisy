import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { DsyButton } from 'ngx-daisy/button';
import { DsyError, DsyFormField, DsyHint } from 'ngx-daisy/form-field';
import { DsyInput } from 'ngx-daisy/input';
import { DsyValidator } from 'ngx-daisy/validator';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-form-field-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    FormRoot,
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
  templateUrl: './form-field-demo.html',
  styleUrl: './form-field-demo.scss',
})
export class FormFieldDemo {
  readonly playground = playground;
  readonly submitted = signal(false);
  readonly model = signal({ email: '' });
  readonly fields = form(
    this.model,
    (s) => {
      required(s.email, { message: 'Email is required' });
      email(s.email, { message: 'Enter a valid email' });
    },
    {
      submission: {
        action: async () => {
          this.submitted.set(true);
        },
      },
    },
  );
  readonly reactive = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
