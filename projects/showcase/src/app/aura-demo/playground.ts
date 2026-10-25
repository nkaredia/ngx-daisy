import { DsyAura } from '@ngx-daisy/cdk/aura';
import type { Playground } from '../playground/playground.types';
import { AuraExample } from './example/aura-example';
export const playground: Playground = {
  components: [{ class: DsyAura /** Generate props during build */ }],
  previews: [AuraExample],
};
