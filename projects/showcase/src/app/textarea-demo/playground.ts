import { DsyTextarea } from '@ngx-daisy/cdk/textarea';
import type { Playground } from '../playground/playground.types';
import { TextareaExample } from './example/textarea-example';

export const playground: Playground = {
  components: [{ class: DsyTextarea /** Generate props during build */ }],
  previews: [TextareaExample],
};
