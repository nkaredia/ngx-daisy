import { DsyStats } from '@ngx-daisy/cdk/stat';
import type { Playground } from '../playground/playground.types';
import { StatExample } from './example/stat-example';
export const playground: Playground = {
  components: [{ class: DsyStats /** Generate props during build */ }],
  previews: [StatExample],
};
