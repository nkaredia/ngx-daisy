import { DsyMockupPhone } from '@ngx-daisy/cdk/mockup-phone';
import type { Playground } from '../playground/playground.types';
import { MockupPhoneExample } from './example/mockup-phone-example';

export const playground: Playground = {
  components: [{ class: DsyMockupPhone /** Generate props during build */ }],
  previews: [MockupPhoneExample],
};
