import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './radio-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyFormField, DsyHint } from '@ngx-daisy/cdk/form-field';
import { DsyRadioButton, DsyRadioGroup } from '@ngx-daisy/cdk/radio';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-radio-demo',
  standalone: true,
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    FormField,
    ReactiveFormsModule,

    DsyFormField,
    DsyHint,

    DsyButton,
    DsyRadioGroup,
    DsyRadioButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './radio-demo.html',
  styleUrl: './radio-demo.scss',
})
export class RadioDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly model = signal({ value: 'email' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<string | null>('sms');
}
