import { DsyChat, DsyChatBubble } from '@ngx-daisy/cdk/chat';
import type { Playground } from '../playground/playground.types';
import { ChatExample } from './example/chat-example';
export const playground: Playground = {
  components: [
    { class: DsyChat /** Generate props during build */ },
    { class: DsyChatBubble /** Generate props during build */ },
  ],
  previews: [ChatExample],
};
