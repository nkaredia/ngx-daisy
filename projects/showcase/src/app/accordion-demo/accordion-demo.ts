import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './accordion-documentation.code';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
} from '@angular/core';
import { DsyAccordion } from '@ngx-daisy/cdk/accordion';
import { DsyCollapse } from '@ngx-daisy/cdk/collapse';

@Component({
  selector: 'demo-accordion-demo',
  providers: providePlayground(playground),
  imports: [DocumentationPage, ComponentDocumentation, Playground, DsyAccordion, DsyCollapse],
  templateUrl: './accordion-demo.html',
  styleUrl: './accordion-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AccordionDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
}
