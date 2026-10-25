import { DsyDiff } from 'ngx-daisy/diff';
import type { Playground } from '../playground/playground.types';
import { DiffExample } from './example/diff-example';
export const playground: Playground = {
  components: [{ class: DsyDiff /** Generate props during build */ }],
  previews: [DiffExample],
};
