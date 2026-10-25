import { DsyAvatar } from 'ngx-daisy/avatar';
import type { Playground } from '../playground/playground.types';
import { AvatarExample } from './example/avatar-example';
export const playground: Playground = {
  components: [{ class: DsyAvatar /** Generate props during build */ }],
  previews: [AvatarExample],
};
