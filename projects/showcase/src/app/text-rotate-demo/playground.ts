import { DsyTextRotate } from 'ngx-daisy/text-rotate';
import type { Playground } from '../playground/playground.types';
import { TextRotateExample } from './example/text-rotate-example';
export const playground: Playground = {
  components: [{ class: DsyTextRotate /** Generate props during build */ }],
  previews: [TextRotateExample],
};
