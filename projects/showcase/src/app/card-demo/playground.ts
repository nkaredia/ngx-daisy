import { DsyCard } from '@ngx-daisy/cdk/card';
import type { Playground } from '../playground/playground.types';
import { CardExample } from './example/card-example';
export const playground: Playground = {
  components: [{ class: DsyCard /** Generate props during build */ }],
  previews: [CardExample],
};
