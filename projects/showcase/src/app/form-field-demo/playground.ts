import { DsyFormField } from '@ngx-daisy/cdk/form-field';
import { DsyInput } from '@ngx-daisy/cdk/input';
import type { Playground } from '../playground/playground.types';
import { FormFieldExample } from './example/form-field-example';

export const playground: Playground = {
  components: [
    { class: DsyFormField /** Generate props during build */ },
    { class: DsyInput /** Generate props during build */ },
  ],
  previews: [FormFieldExample],
};
