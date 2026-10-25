import { DsyTooltip } from '@ngx-daisy/cdk/tooltip';
import type { Playground } from '../playground/playground.types';
import { TooltipExample } from './example/tooltip-example';

export const playground: Playground = {
  components: [{ class: DsyTooltip /** Generate props during build */ }],
  previews: [TooltipExample],
};
