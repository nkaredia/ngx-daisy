import {
  DsyMenu,
  DsyMenuItem,
  DsyMenuSubmenu,
  DsyMenuDropdown,
  DsyMenuDropdownToggle,
  DsyMenuTitle,
} from 'ngx-daisy/menu';
import type { Playground } from '../playground/playground.types';
import { MenuExample } from './example/menu-example';

export const playground: Playground = {
  components: [
    { class: DsyMenu /** Generate props during build */ },
    { class: DsyMenuItem /** Generate props during build */ },
    { class: DsyMenuSubmenu /** Generate props during build */ },
    { class: DsyMenuDropdown /** Generate props during build */ },
    { class: DsyMenuDropdownToggle /** Generate props during build */ },
    { class: DsyMenuTitle /** Generate props during build */ },
  ],
  previews: [MenuExample],
};
