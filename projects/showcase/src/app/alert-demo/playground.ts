import { DsyAlert } from '@ngx-daisy/cdk/alert';
import type { Playground } from '../playground/playground.types';
import { AlertExample } from './example/alert-example';

export const playground: Playground = {
  components: [{ class: DsyAlert /** Generate props during build */ }],
  previews: [AlertExample],
};
