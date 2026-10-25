import { DsyTable, DsyTableRow } from '@ngx-daisy/cdk/table';
import type { Playground } from '../playground/playground.types';
import { TableExample } from './example/table-example';
export const playground: Playground = {
  components: [
    { class: DsyTable /** Generate props during build */ },
    { class: DsyTableRow /** Generate props during build */ },
  ],
  previews: [TableExample],
};
