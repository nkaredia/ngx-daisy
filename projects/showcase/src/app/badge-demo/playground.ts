import { DsyBadge } from 'ngx-daisy/badge';
import type { Playground } from '../playground/playground.types';
import { BadgeExample } from './example/badge-example';
export const playground: Playground = {
  components: [{ class: DsyBadge /** Generate props during build */ }],
  previews: [BadgeExample],
};
