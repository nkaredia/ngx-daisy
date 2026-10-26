import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './card-documentation.code';
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
import { DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions } from '@ngx-daisy/cdk/card';

@Component({
  selector: 'demo-card-demo',
  providers: providePlayground(playground),
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyCard,
    DsyCardBody,
    DsyCardTitle,
    DsyCardActions,
  ],
  templateUrl: './card-demo.html',
  styleUrl: './card-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly selected = signal('None');
}
