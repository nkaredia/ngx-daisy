import { NativeActionsExample } from '../actions-example/actions-example';
import { DsySwap } from '@ngx-daisy/native/swap';
import { NativeSwapsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [
    { onText: 'Notifications on', offText: 'Notifications off', label: 'Notifications' },
  ],
  components: [{ class: DsySwap /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeActionsExample }],
  previews: [NativeSwapsPreview],
};
