import { NativeFormCompositionExample } from '../form-composition-example/form-composition-example';
import { DsySelect } from '@ngx-daisy/native/select';
import { NativeSelectsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ value: 'us', label: 'Country', placeholder: 'Choose a country' }],
  components: [{ class: DsySelect /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeFormCompositionExample }],
  previews: [NativeSelectsPreview],
};
