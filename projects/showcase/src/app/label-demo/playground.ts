import { DsyFloatingLabel } from 'ngx-daisy/label';
import { DsyInput } from 'ngx-daisy/input';
import type { Playground } from '../playground/playground.types';
import { LabelExample } from './example/label-example';

export const playground: Playground = {
  components: [
    { class: DsyFloatingLabel /** Generate props during build */ },
    { class: DsyInput /** Generate props during build */ },
  ],
  previews: [LabelExample],
};
