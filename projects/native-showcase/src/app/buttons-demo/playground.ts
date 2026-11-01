import { NativeButtonExample } from '../button-example/button-example';
import { DsyButton } from '@ngx-daisy/native/button';
import { NativeButtonsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ text: 'Save changes', color: 'primary' }],
  components: [{ class: DsyButton /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeButtonExample }],
  previews: [NativeButtonsPreview],
};
