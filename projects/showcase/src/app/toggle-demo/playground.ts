import { DsyToggle } from 'ngx-daisy/toggle';
import type { Playground } from '../playground/playground.types';
import { ToggleExample } from './example/toggle-example';

export const playground: Playground = {
  components: [{ class: DsyToggle /** Generate props during build */ }],
  previews: [ToggleExample],
};
