import { DsyIndicator, DsyIndicatorItem } from 'ngx-daisy/indicator';
import type { Playground } from '../playground/playground.types';
import { IndicatorExample } from './example/indicator-example';

export const playground: Playground = {
  components: [
    { class: DsyIndicator /** Generate props during build */ },
    { class: DsyIndicatorItem /** Generate props during build */ },
  ],
  previews: [IndicatorExample],
};
