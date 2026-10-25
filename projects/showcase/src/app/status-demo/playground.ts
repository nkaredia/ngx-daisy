import { DsyStatus } from '@ngx-daisy/cdk/status';
import type { Playground } from '../playground/playground.types';
import { StatusExample } from './example/status-example';
export const playground: Playground = {
  components: [{ class: DsyStatus /** Generate props during build */ }],
  previews: [StatusExample],
};
