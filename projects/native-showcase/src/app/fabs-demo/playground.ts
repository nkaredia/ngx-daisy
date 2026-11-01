import { NativeActionsExample } from '../actions-example/actions-example';
import { DsyFab } from '@ngx-daisy/native/fab';
import { NativeFabsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{}],
  components: [{ class: DsyFab /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeActionsExample }],
  previews: [NativeFabsPreview],
};
