import { NativeDisplayExample } from '../display-example/display-example';
import { DsyDivider } from '@ngx-daisy/native/divider';
import { NativeDividersPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ text: 'CURRENT PLAN' }],
  components: [{ class: DsyDivider /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeDisplayExample }],
  previews: [NativeDividersPreview],
};
