import { DsyFilter } from '@ngx-daisy/cdk/filter';
import type { Playground } from '../playground/playground.types';
import { FilterExample } from './example/filter-example';

export const playground: Playground = {
  components: [{ class: DsyFilter /** Generate props during build */ }],
  previews: [FilterExample],
};
