import { DsyButton } from '@ngx-daisy/cdk/button';
import type { Playground } from '../playground/playground.types';
import { ButtonExample } from './example/button-example';

import { ButtonStartExample } from './example/button-start-example';
import { ButtonBasicsExample } from './example/button-basics-example';
import { ButtonColorsExample } from './example/button-colors-example';
import { ButtonSizesExample } from './example/button-sizes-example';
import { ButtonVariantsExample } from './example/button-variants-example';
import { ButtonStatesExample } from './example/button-states-example';
export const playground: Playground = {
  components: [
    {
      class: DsyButton,
      /**  Generate props during build  */
    },
  ],
  previews: [ButtonExample],
  inlinePreviews: [
    { title: 'Your first button', component: ButtonStartExample, showTypescript: true },
    { title: 'Basics', component: ButtonBasicsExample },
    { title: 'Colors', component: ButtonColorsExample },
    { title: 'Sizes', component: ButtonSizesExample },
    { title: 'Variants', component: ButtonVariantsExample },
    { title: 'Shapes, layouts and states', component: ButtonStatesExample },
  ],
};
