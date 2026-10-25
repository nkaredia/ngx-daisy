import { DsySelect } from 'ngx-daisy/select';
import type { Playground } from '../playground/playground.types';
import { SelectExample } from './example/select-example';

export const playground: Playground = {
  components: [{ class: DsySelect /** Generate props during build */ }],
  previews: [SelectExample],
};
