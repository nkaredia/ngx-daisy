import { DsyInput } from '@ngx-daisy/cdk/input';
import type { Playground } from '../playground/playground.types';
import { InputExample } from './example/input-example';

export const playground: Playground = {
  components: [{ class: DsyInput /** Generate props during build */ }],
  previews: [InputExample],
};
