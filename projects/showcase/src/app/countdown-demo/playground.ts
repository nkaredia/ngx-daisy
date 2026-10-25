import { DsyCountdown } from 'ngx-daisy/countdown';
import type { Playground } from '../playground/playground.types';
import { CountdownExample } from './example/countdown-example';
export const playground: Playground = {
  components: [{ class: DsyCountdown /** Generate props during build */ }],
  previews: [CountdownExample],
};
