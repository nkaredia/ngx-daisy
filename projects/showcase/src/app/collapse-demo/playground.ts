import { DsyCollapse } from '@ngx-daisy/cdk/collapse';
import type { Playground } from '../playground/playground.types';
import { CollapseExample } from './example/collapse-example';
export const playground: Playground = {
  components: [{ class: DsyCollapse /** Generate props during build */ }],
  previews: [CollapseExample],
};
