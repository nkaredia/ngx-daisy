import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './diff-documentation.code';
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
import { DsyDiff } from '@ngx-daisy/cdk/diff';

@Component({
  selector: 'demo-diff-demo',
  providers: providePlayground(playground),
  imports: [DocumentationPage, ComponentDocumentation, Playground, DsyDiff],
  templateUrl: './diff-demo.html',
  styleUrl: './diff-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DiffDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly position = signal(50);
}
