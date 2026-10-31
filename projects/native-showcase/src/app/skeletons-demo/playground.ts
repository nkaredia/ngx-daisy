import { NativeFeedbackExample } from '../feedback-example/feedback-example';
import { DsySkeleton } from '@ngx-daisy/native/skeleton';
import { NativeSkeletonsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{}],
  components: [{ class: DsySkeleton /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeFeedbackExample }],
  previews: [NativeSkeletonsPreview],
};
