import { DsyFooter, DsyFooterTitle } from '@ngx-daisy/cdk/footer';
import type { Playground } from '../playground/playground.types';
import { FooterExample } from './example/footer-example';

export const playground: Playground = {
  components: [
    { class: DsyFooter /** Generate props during build */ },
    { class: DsyFooterTitle /** Generate props during build */ },
  ],
  previews: [FooterExample],
};
