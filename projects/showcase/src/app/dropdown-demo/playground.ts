import { DsyDropdown } from 'ngx-daisy/dropdown';
import type { Playground } from '../playground/playground.types';
import { DropdownExample } from './example/dropdown-example';

export const playground: Playground = {
  components: [{ class: DsyDropdown /** Generate props during build */ }],
  previews: [DropdownExample],
};
