import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './select-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyFormField, DsyHint } from '@ngx-daisy/cdk/form-field';
import { DsySelect, DsySelectWrapper } from '@ngx-daisy/cdk/select';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-select-demo',
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
    DsySelect,
    DsySelectWrapper,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './select-demo.html',
  styleUrl: './select-demo.scss',
})
export class SelectDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly model = signal({ value: 'angular' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl('angular', { nonNullable: true });
  readonly disabled = signal(false);
}
