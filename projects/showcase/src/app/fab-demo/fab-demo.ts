import {
  LucidePlus,
  LucideX,
  LucideArrowUpRight,
  LucideCheck,
  LucideDownload,
} from '@lucide/angular';
import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './fab-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';
import {
  DsyFab,
  DsyFabTrigger,
  DsyFabAction,
  DsyFabClose,
  DsyFabMainAction,
} from '@ngx-daisy/cdk/fab';
@Component({
  selector: 'demo-fab-demo',
  standalone: true,
  providers: providePlayground(playground),
  imports: [
    LucidePlus,
    LucideX,
    LucideArrowUpRight,
    LucideCheck,
    LucideDownload,
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyButton,
    DsyFab,
    DsyFabTrigger,
    DsyFabAction,
    DsyFabClose,
    DsyFabMainAction,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fab-demo.html',
  styleUrl: './fab-demo.scss',
})
export class FabDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly action = signal('Choose an action');
}
