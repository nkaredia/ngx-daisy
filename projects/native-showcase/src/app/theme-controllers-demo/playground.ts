import { NativeActionsExample } from '../actions-example/actions-example';
import { DsyThemeController } from '@ngx-daisy/native/theme-controller';
import { NativeThemeControllersPreview } from './example/example';
import type { NativePlaygroundConfig } from '../playground/types';
export const playground: NativePlaygroundConfig = {
  initialValues: [{ label: 'Use dark theme' }],
  components: [{ class: DsyThemeController /** Generate props during build */ }],
  inlinePreviews: [{ title: 'Common variations', component: NativeActionsExample }],
  previews: [NativeThemeControllersPreview],
};
