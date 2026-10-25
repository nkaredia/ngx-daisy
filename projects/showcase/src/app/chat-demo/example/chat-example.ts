import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyChat, DsyChatBubble, DsyChatHeader, DsyChatFooter } from 'ngx-daisy/chat';
export interface ChatExampleValues {
  readonly position?: ReturnType<DsyChat['position']>;
}
export interface ChatBubbleExampleValues {
  readonly color?: ReturnType<DsyChatBubble['color']>;
}
@Component({
  selector: 'demo-chat-example',
  standalone: true,
  imports: [DsyChat, DsyChatBubble, DsyChatHeader, DsyChatFooter],
  templateUrl: './chat-example.html',
  styleUrl: './chat-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChatExample {
  readonly values = input<readonly [ChatExampleValues?, ChatBubbleExampleValues?]>([]);
  readonly props = computed<ChatExampleValues>(() => this.values()[0] ?? {});
  readonly bubble = computed<ChatBubbleExampleValues>(() => this.values()[1] ?? {});
}
