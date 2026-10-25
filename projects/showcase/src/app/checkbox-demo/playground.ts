import { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';
import type { Playground } from '../playground/playground.types';
import { CheckboxExample } from './example/checkbox-example';

export const playground: Playground = {
  components: [{ class: DsyCheckbox /** Generate props during build */ }],
  previews: [CheckboxExample],
};
