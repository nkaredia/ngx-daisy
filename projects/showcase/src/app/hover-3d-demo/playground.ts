import { DsyHover3d } from 'ngx-daisy/hover-3d';
import type { Playground } from '../playground/playground.types';
import { Hover3DExample } from './example/hover-3d-example';
export const playground: Playground = {
  components: [{ class: DsyHover3d /** Generate props during build */ }],
  previews: [Hover3DExample],
};
