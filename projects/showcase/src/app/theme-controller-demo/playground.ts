import { DsyThemeController } from '@ngx-daisy/cdk/theme-controller';
import type { Playground } from '../playground/playground.types';
import { ThemeControllerExample } from './example/theme-controller-example';

export const playground: Playground = {
  components: [{ class: DsyThemeController /** Generate props during build */ }],
  previews: [ThemeControllerExample],
};
