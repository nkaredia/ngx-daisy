import { DropdownActionsExample } from './example/dropdown-actions-example';
import { DropdownPreferencesExample } from './example/dropdown-preferences-example';
import { DsyDropdown } from '@ngx-daisy/cdk/dropdown';
import type { Playground } from '../playground/playground.types';
import { DropdownExample } from './example/dropdown-example';

export const playground: Playground = {
  components: [{ class: DsyDropdown /** Generate props during build */ }],
  previews: [DropdownExample],
  inlinePreviews: [
    { title: 'Document actions', component: DropdownActionsExample, showTypescript: true },
    {
      title: 'Notification preferences',
      component: DropdownPreferencesExample,
      showTypescript: true,
    },
  ],
};
