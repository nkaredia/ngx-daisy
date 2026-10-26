import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './join-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { DsyButton } from '@ngx-daisy/cdk/button';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyJoin, DsyJoinItem } from '@ngx-daisy/cdk/join';

@Component({
  selector: 'demo-join-demo',
  providers: providePlayground(playground),
  imports: [DocumentationPage, ComponentDocumentation, Playground, DsyJoin, DsyJoinItem, DsyButton],
  templateUrl: './join-demo.html',
  styleUrl: './join-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class JoinDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly selected = signal('Day');
}
