import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyFileInput } from '@ngx-daisy/cdk/file-input';
import { DsyFormField, DsyHint } from '@ngx-daisy/cdk/form-field';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-file-input-demo',
  standalone: true,
  imports: [
    Playground,
    FormField,
    ReactiveFormsModule,
    DsyFormField,
    DsyHint,
    DsyButton,
    DsyFileInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './file-input-demo.html',
  styleUrl: './file-input-demo.scss',
})
export class FileInputDemo {
  readonly playground = playground;
  readonly model = signal<{ value: readonly File[] | null }>({ value: [] });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<readonly File[] | null>([]);
}
