import { DsyDivider } from '@ngx-daisy/cdk/divider';
import type { Playground } from '../playground/playground.types';
import { DividerExample } from './example/divider-example';

export const playground: Playground = {
  components: [{ class: DsyDivider /** Generate props during build */ }],
  previews: [DividerExample],
};
