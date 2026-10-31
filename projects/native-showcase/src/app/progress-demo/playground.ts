import { NativeFeedbackExample } from '../feedback-example/feedback-example';
import { DsyProgress } from '@ngx-daisy/native/progress';
import { NativeProgressPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ value: 35, color: 'primary', label: 'Project upload' }],
  components: [{ class: DsyProgress /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeFeedbackExample }],
  previews: [NativeProgressPreview],
};
