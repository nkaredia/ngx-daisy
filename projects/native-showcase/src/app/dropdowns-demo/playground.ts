import { NativeActionsExample } from '../actions-example/actions-example';
import { DsyDropdown } from '@ngx-daisy/native/dropdown';
import { NativeDropdownsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{}],
  components: [{ class: DsyDropdown /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeActionsExample }],
  previews: [NativeDropdownsPreview],
};
