import { DsyProgress } from 'ngx-daisy/progress';
import type { Playground } from '../playground/playground.types';
import { ProgressExample } from './example/progress-example';

export const playground: Playground = {
  components: [{ class: DsyProgress /** Generate props during build */ }],
  previews: [ProgressExample],
};
