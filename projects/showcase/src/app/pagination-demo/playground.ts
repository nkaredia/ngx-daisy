import { DsyPagination } from '@ngx-daisy/cdk/pagination';
import type { Playground } from '../playground/playground.types';
import { PaginationExample } from './example/pagination-example';

export const playground: Playground = {
  components: [{ class: DsyPagination /** Generate props during build */ }],
  previews: [PaginationExample],
};
