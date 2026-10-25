import { DsyRadialProgress } from 'ngx-daisy/radial-progress';
import type { Playground } from '../playground/playground.types';
import { RadialProgressExample } from './example/radial-progress-example';

export const playground: Playground = {
  components: [{ class: DsyRadialProgress /** Generate props during build */ }],
  previews: [RadialProgressExample],
};
