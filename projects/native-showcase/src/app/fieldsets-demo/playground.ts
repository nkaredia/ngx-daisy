import { NativeFormCompositionExample } from '../form-composition-example/form-composition-example';
import { DsyFieldset } from '@ngx-daisy/native/fieldset';
import { NativeFieldsetsPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [
    { legend: 'Your profile', description: 'A few details to make this space your own.' },
  ],
  components: [{ class: DsyFieldset /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeFormCompositionExample }],
  previews: [NativeFieldsetsPreview],
};
