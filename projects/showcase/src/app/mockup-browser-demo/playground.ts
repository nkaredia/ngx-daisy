import { DsyMockupBrowser, DsyBrowserToolbar } from '@ngx-daisy/cdk/mockup-browser';
import type { Playground } from '../playground/playground.types';
import { MockupBrowserExample } from './example/mockup-browser-example';

export const playground: Playground = {
  components: [
    { class: DsyMockupBrowser /** Generate props during build */ },
    { class: DsyBrowserToolbar /** Generate props during build */ },
  ],
  previews: [MockupBrowserExample],
};
