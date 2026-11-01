import { NativeDataInputExample } from '../data-input-example/data-input-example';
import { DsyToggle } from '@ngx-daisy/native/toggle';
import { NativeTogglesPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ label: 'Workspace updates', checked: true }],
  components: [{ class: DsyToggle /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeDataInputExample }],
  previews: [NativeTogglesPreview],
};
