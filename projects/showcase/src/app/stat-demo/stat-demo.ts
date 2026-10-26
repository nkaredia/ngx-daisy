import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './stat-documentation.code';
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
import {
  DsyStats,
  DsyStat,
  DsyStatTitle,
  DsyStatValue,
  DsyStatDesc,
  DsyStatFigure,
  DsyStatActions,
} from '@ngx-daisy/cdk/stat';

@Component({
  selector: 'demo-stat-demo',
  providers: providePlayground(playground),
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyStats,
    DsyStat,
    DsyStatTitle,
    DsyStatValue,
    DsyStatDesc,
    DsyStatFigure,
    DsyStatActions,
  ],
  templateUrl: './stat-demo.html',
  styleUrl: './stat-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StatDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
}
