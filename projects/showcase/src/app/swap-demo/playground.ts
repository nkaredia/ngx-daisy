import { DsySwap } from 'ngx-daisy/swap';
import type { Playground } from '../playground/playground.types';
import { SwapExample } from './example/swap-example';

export const playground: Playground = {
  components: [{ class: DsySwap /** Generate props during build */ }],
  previews: [SwapExample],
};
