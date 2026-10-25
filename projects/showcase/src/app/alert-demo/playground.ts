import { DsyAlert } from 'ngx-daisy/alert';
import type { Playground } from '../playground/playground.types';
import { AlertExample } from './example/alert-example';

export const playground: Playground = {
  components: [{ class: DsyAlert /** Generate props during build */ }],
  previews: [AlertExample],
};
