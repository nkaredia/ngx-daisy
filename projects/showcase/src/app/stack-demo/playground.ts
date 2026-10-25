import { DsyStack } from '@ngx-daisy/cdk/stack';
import type { Playground } from '../playground/playground.types';
import { StackExample } from './example/stack-example';

export const playground: Playground = {
  components: [{ class: DsyStack /** Generate props during build */ }],
  previews: [StackExample],
};
