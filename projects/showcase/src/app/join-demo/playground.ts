import { DsyJoin, DsyJoinItem } from '@ngx-daisy/cdk/join';
import type { Playground } from '../playground/playground.types';
import { JoinExample } from './example/join-example';

export const playground: Playground = {
  components: [
    { class: DsyJoin /** Generate props during build */ },
    { class: DsyJoinItem /** Generate props during build */ },
  ],
  previews: [JoinExample],
};
