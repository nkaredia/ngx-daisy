import { DsyAccordion } from 'ngx-daisy/accordion';
import { DsyCollapse } from 'ngx-daisy/collapse';
import type { Playground } from '../playground/playground.types';
import { AccordionExample } from './example/accordion-example';
export const playground: Playground = {
  components: [
    { class: DsyAccordion /** Generate props during build */ },
    { class: DsyCollapse /** Generate props during build */ },
  ],
  previews: [AccordionExample],
};
