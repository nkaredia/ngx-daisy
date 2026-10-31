import { NativeDisplayExample } from '../display-example/display-example';
import { DsyCard } from '@ngx-daisy/native/card';
import { NativeCardsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ border: 'solid' }],
  components: [{ class: DsyCard /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeDisplayExample }],
  previews: [NativeCardsPreview],
};
