import { DsyFileInput } from 'ngx-daisy/file-input';
import type { Playground } from '../playground/playground.types';
import { FileInputExample } from './example/file-input-example';

export const playground: Playground = {
  components: [{ class: DsyFileInput /** Generate props during build */ }],
  previews: [FileInputExample],
};
