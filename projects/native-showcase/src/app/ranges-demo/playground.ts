import { NativeSelectionExample } from '../selection-example/selection-example';
import { DsyRange } from '@ngx-daisy/native/range';
import { NativeRangesPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ value: 40, min: 0, max: 100, label: 'Volume' }],
  components: [{ class: DsyRange /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeSelectionExample }],
  previews: [NativeRangesPreview],
};
