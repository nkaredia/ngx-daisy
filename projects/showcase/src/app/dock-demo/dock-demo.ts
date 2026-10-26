import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './dock-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyDock, DsyDockItem, DsyDockLabel } from '@ngx-daisy/cdk/dock';

@Component({
  selector: 'demo-dock-demo',
  providers: providePlayground(playground),
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyDock,
    DsyDockItem,
    DsyDockLabel,
  ],
  templateUrl: './dock-demo.html',
  styleUrl: './dock-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DockDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly selected = signal('Home');
}
