import { NativeDataInputExample } from '../data-input-example/data-input-example';
import { DsyInput } from '@ngx-daisy/native/input';
import { NativeInputsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ value: 'Alex Morgan', label: 'Display name' }],
  components: [{ class: DsyInput /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeDataInputExample }],
  previews: [NativeInputsPreview],
};
