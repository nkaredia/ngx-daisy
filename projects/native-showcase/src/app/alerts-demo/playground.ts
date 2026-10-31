import { NativeFeedbackExample } from '../feedback-example/feedback-example';
import { DsyAlert } from '@ngx-daisy/native/alert';
import { NativeAlertsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [
    {
      title: 'Your changes are saved',
      message: 'Everything is up to date across your devices.',
      color: 'success',
      variant: 'soft',
    },
  ],
  components: [{ class: DsyAlert /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeFeedbackExample }],
  previews: [NativeAlertsPreview],
};
