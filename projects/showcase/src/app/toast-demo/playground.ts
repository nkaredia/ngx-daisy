import { DsyToastOutlet } from '@ngx-daisy/cdk/toast';
import type { Playground } from '../playground/playground.types';
import { ToastExample } from './example/toast-example';

export const playground: Playground = {
  components: [{ class: DsyToastOutlet /** Generate props during build */ }],
  previews: [ToastExample],
};
