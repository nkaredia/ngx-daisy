import { DsyLink } from '@ngx-daisy/cdk/link';
import type { Playground } from '../playground/playground.types';
import { LinkExample } from './example/link-example';

export const playground: Playground = {
  components: [{ class: DsyLink /** Generate props during build */ }],
  previews: [LinkExample],
};
