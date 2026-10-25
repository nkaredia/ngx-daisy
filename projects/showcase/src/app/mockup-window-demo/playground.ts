import { DsyMockupWindow } from 'ngx-daisy/mockup-window';
import type { Playground } from '../playground/playground.types';
import { MockupWindowExample } from './example/mockup-window-example';

export const playground: Playground = {
  components: [{ class: DsyMockupWindow /** Generate props during build */ }],
  previews: [MockupWindowExample],
};
