import { DsyRadioGroup } from 'ngx-daisy/radio';
import type { Playground } from '../playground/playground.types';
import { RadioExample } from './example/radio-example';

export const playground: Playground = {
  components: [{ class: DsyRadioGroup /** Generate props during build */ }],
  previews: [RadioExample],
};
