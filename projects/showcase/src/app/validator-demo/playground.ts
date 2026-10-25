import { DsyValidator } from 'ngx-daisy/validator';
import { DsyInput } from 'ngx-daisy/input';
import type { Playground } from '../playground/playground.types';
import { ValidatorExample } from './example/validator-example';

export const playground: Playground = {
  components: [
    { class: DsyValidator /** Generate props during build */ },
    { class: DsyInput /** Generate props during build */ },
  ],
  previews: [ValidatorExample],
};
