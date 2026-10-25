import { DsyModal } from '@ngx-daisy/cdk/modal';
import type { Playground } from '../playground/playground.types';
import { ModalExample } from './example/modal-example';

export const playground: Playground = {
  components: [{ class: DsyModal /** Generate props during build */ }],
  previews: [ModalExample],
};
