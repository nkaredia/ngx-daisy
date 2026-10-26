import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './textarea-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyFormField, DsyHint } from '@ngx-daisy/cdk/form-field';
import { DsyTextarea } from '@ngx-daisy/cdk/textarea';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-textarea-demo',
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
    DsyTextarea,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './textarea-demo.html',
  styleUrl: './textarea-demo.scss',
})
export class TextareaDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly model = signal({ value: '' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl('', { nonNullable: true });
  readonly disabled = signal(false);
}
