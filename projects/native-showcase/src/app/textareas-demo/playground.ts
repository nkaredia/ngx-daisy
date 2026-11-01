import { NativeDataInputExample } from '../data-input-example/data-input-example';
import { DsyTextarea } from '@ngx-daisy/native/textarea';
import { NativeTextareasPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ value: 'Designer, maker and weekend explorer.', label: 'About you' }],
  components: [{ class: DsyTextarea /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeDataInputExample }],
  previews: [NativeTextareasPreview],
};
