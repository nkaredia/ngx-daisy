import { DsyFieldset } from '@ngx-daisy/cdk/fieldset';
import { DsyInput } from '@ngx-daisy/cdk/input';
import type { Playground } from '../playground/playground.types';
import { FieldsetExample } from './example/fieldset-example';

export const playground: Playground = {
  components: [
    { class: DsyFieldset /** Generate props during build */ },
    { class: DsyInput /** Generate props during build */ },
  ],
  previews: [FieldsetExample],
};
