import { DsyTimeline } from 'ngx-daisy/timeline';
import type { Playground } from '../playground/playground.types';
import { TimelineExample } from './example/timeline-example';
export const playground: Playground = {
  components: [{ class: DsyTimeline /** Generate props during build */ }],
  previews: [TimelineExample],
};
