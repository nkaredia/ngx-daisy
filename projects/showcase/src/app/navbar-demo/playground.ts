import { DsyNavbar, DsyNavbarStart, DsyNavbarCenter, DsyNavbarEnd } from '@ngx-daisy/cdk/navbar';
import type { Playground } from '../playground/playground.types';
import { NavbarExample } from './example/navbar-example';

export const playground: Playground = {
  components: [
    { class: DsyNavbar /** Generate props during build */ },
    { class: DsyNavbarStart /** Generate props during build */ },
    { class: DsyNavbarCenter /** Generate props during build */ },
    { class: DsyNavbarEnd /** Generate props during build */ },
  ],
  previews: [NavbarExample],
};
