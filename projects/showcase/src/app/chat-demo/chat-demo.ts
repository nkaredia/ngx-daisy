import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
} from '@angular/core';
import { DsyChat, DsyChatHeader, DsyChatBubble, DsyChatFooter, DsyChatImage } from 'ngx-daisy/chat';

@Component({
  selector: 'demo-chat-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyChat, DsyChatHeader, DsyChatBubble, DsyChatFooter, DsyChatImage],
  templateUrl: './chat-demo.html',
  styleUrl: './chat-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChatDemo {
  readonly playground = playground;
}
