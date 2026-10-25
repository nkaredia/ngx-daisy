import { DsyLoader } from 'ngx-daisy/loader';
import type { Playground } from '../playground/playground.types';
import { LoaderExample } from './example/loader-example';

export const playground: Playground = {
  components: [{ class: DsyLoader /** Generate props during build */ }],
  previews: [LoaderExample],
};
