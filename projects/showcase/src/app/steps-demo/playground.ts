import { DsySteps, DsyStep, DsyStepIcon } from '@ngx-daisy/cdk/steps';
import type { Playground } from '../playground/playground.types';
import { StepsExample } from './example/steps-example';

export const playground: Playground = {
  components: [
    { class: DsySteps /** Generate props during build */ },
    { class: DsyStep /** Generate props during build */ },
    { class: DsyStepIcon /** Generate props during build */ },
  ],
  previews: [StepsExample],
};
