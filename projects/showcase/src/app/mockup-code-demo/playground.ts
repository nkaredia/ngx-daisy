import { DsyMockupCode, DsyCodeLine } from 'ngx-daisy/mockup-code';
import type { Playground } from '../playground/playground.types';
import { MockupCodeExample } from './example/mockup-code-example';

export const playground: Playground = {
  components: [
    { class: DsyMockupCode /** Generate props during build */ },
    { class: DsyCodeLine /** Generate props during build */ },
  ],
  previews: [MockupCodeExample],
};
