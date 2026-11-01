import { LucideCircle } from '@lucide/angular';
import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './timeline-documentation.code';
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
  DsyTimeline,
  DsyTimelineStart,
  DsyTimelineMiddle,
  DsyTimelineEnd,
  DsyTimelineBox,
} from '@ngx-daisy/cdk/timeline';

@Component({
  selector: 'demo-timeline-demo',
  providers: providePlayground(playground),
  imports: [
    LucideCircle,
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyTimeline,
    DsyTimelineStart,
    DsyTimelineMiddle,
    DsyTimelineEnd,
    DsyTimelineBox,
  ],
  templateUrl: './timeline-demo.html',
  styleUrl: './timeline-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TimelineDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
}
