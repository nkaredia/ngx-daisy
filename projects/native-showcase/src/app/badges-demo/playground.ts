import { NativeDisplayExample } from '../display-example/display-example';
import { DsyBadge } from '@ngx-daisy/native/badge';
import { NativeBadgesPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ text: 'In review', color: 'warning', variant: 'soft' }],
  components: [{ class: DsyBadge /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeDisplayExample }],
  previews: [NativeBadgesPreview],
};
