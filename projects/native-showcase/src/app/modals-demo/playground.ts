import { NativeActionsExample } from '../actions-example/actions-example';
import { DsyModal } from '@ngx-daisy/native/modal';
import { NativeModalsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ label: 'Create project' }],
  components: [{ class: DsyModal /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeActionsExample }],
  previews: [NativeModalsPreview],
};
