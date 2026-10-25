import { DsyKbd } from '@ngx-daisy/cdk/kbd';
import type { Playground } from '../playground/playground.types';
import { KbdExample } from './example/kbd-example';
export const playground: Playground = {
  components: [{ class: DsyKbd /** Generate props during build */ }],
  previews: [KbdExample],
};
