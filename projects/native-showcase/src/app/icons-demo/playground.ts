import { NativeIconExample } from '../icon-example/icon-example';
import { DsyIcon } from '@ngx-daisy/native/icon';
import { NativeIconsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ size: 36, color: 'primary', label: 'Favorite' }],
  components: [{ class: DsyIcon /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeIconExample }],
  previews: [NativeIconsPreview],
};
