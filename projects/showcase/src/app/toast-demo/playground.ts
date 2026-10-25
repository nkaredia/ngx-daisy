import { DsyToastOutlet } from 'ngx-daisy/toast';
import type { Playground } from '../playground/playground.types';
import { ToastExample } from './example/toast-example';

export const playground: Playground = {
  components: [{ class: DsyToastOutlet /** Generate props during build */ }],
  previews: [ToastExample],
};
