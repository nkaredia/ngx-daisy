import { NativeSelectionExample } from '../selection-example/selection-example';
import { DsyRadioGroup } from '@ngx-daisy/native/radio';
import { NativeRadiosPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ value: 'personal', label: 'Workspace type' }],
  components: [{ class: DsyRadioGroup /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeSelectionExample }],
  previews: [NativeRadiosPreview],
};
