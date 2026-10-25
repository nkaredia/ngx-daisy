import { DsyRange } from 'ngx-daisy/range';
import type { Playground } from '../playground/playground.types';
import { RangeExample } from './example/range-example';

export const playground: Playground = {
  components: [{ class: DsyRange /** Generate props during build */ }],
  previews: [RangeExample],
};
