import { DsyIcon } from 'ngx-daisy/icon';
import type { Playground } from '../playground/playground.types';
import { IconExample } from './example/icon-example';
export const playground: Playground = {
  components: [{ class: DsyIcon /** Generate props during build */ }],
  previews: [IconExample],
};
