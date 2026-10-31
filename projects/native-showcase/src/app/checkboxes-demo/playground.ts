import { NativeSelectionExample } from '../selection-example/selection-example';
import { DsyCheckbox } from '@ngx-daisy/native/checkbox';
import { NativeCheckboxesPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [
    { label: 'Send tracking updates', description: 'Get a notification when your order ships.' },
  ],
  components: [{ class: DsyCheckbox /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeSelectionExample }],
  previews: [NativeCheckboxesPreview],
};
