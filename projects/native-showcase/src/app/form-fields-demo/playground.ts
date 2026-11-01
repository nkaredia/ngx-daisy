import { NativeFormCompositionExample } from '../form-composition-example/form-composition-example';
import { DsyFormField } from '@ngx-daisy/native/form-field';
import { NativeFormFieldsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ label: 'Display name', hint: 'Use the name your team knows.' }],
  components: [{ class: DsyFormField /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeFormCompositionExample }],
  previews: [NativeFormFieldsPreview],
};
