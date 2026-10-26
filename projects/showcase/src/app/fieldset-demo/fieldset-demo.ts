import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './fieldset-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';
import { DsyFieldset, DsyLegend, DsyFieldsetLabel } from '@ngx-daisy/cdk/fieldset';
import { DsyFormField } from '@ngx-daisy/cdk/form-field';
import { DsyInput } from '@ngx-daisy/cdk/input';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-fieldset-demo',
  standalone: true,
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    FormField,
    DsyFormField,
    DsyFieldset,
    DsyLegend,
    DsyFieldsetLabel,
    DsyInput,
    DsyCheckbox,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fieldset-demo.html',
  styleUrl: './fieldset-demo.scss',
})
export class FieldsetDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly model = signal({ name: 'Workspace', updates: true });
  readonly fields = form(this.model);
  readonly locked = signal(false);
}
