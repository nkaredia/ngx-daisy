import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  DsyTimeline,
  DsyTimelineStart,
  DsyTimelineMiddle,
  DsyTimelineEnd,
  DsyTimelineBox,
} from 'ngx-daisy/timeline';
export interface TimelineExampleValues {
  readonly orientation?: ReturnType<DsyTimeline['orientation']>;
  readonly compact?: ReturnType<DsyTimeline['compact']>;
  readonly snapIcon?: ReturnType<DsyTimeline['snapIcon']>;
}
@Component({
  selector: 'demo-timeline-example',
  standalone: true,
  imports: [DsyTimeline, DsyTimelineStart, DsyTimelineMiddle, DsyTimelineEnd, DsyTimelineBox],
  templateUrl: './timeline-example.html',
  styleUrl: './timeline-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TimelineExample {
  readonly values = input<readonly TimelineExampleValues[]>([]);
  readonly props = computed<TimelineExampleValues>(() => this.values()[0] ?? {});
}
