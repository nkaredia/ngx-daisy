import { DsyMask } from '@ngx-daisy/cdk/mask';
import type { Playground } from '../playground/playground.types';
import { MaskExample } from './example/mask-example';

export const playground: Playground = {
  components: [{ class: DsyMask /** Generate props during build */ }],
  previews: [MaskExample],
};
