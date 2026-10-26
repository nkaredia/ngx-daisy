import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'chat',
  entryPoint: '@ngx-daisy/cdk/chat',
  summary: 'Arrange message bubbles with sender, time and delivery metadata.',
  usage: [
    'Use start/end alignment to distinguish participants and keep chronological reading order. Project avatars and metadata only when they add context.',
  ],
  angular: [
    'Chat is a content layout, not a messaging service or automatic live region. Render messages with Angular collections and own transport, ordering and announcement policy in the app.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Associate messages with readable sender names and timestamps. Announce new messages politely when appropriate; avoid re-announcing the entire conversation.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'chat-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport {\n  DsyChat,\n  DsyChatHeader,\n  DsyChatBubble,\n  DsyChatFooter,\n} from '@ngx-daisy/cdk/chat';\n\n@Component({\n  selector: 'app-chat-example',\n  imports: [DsyChat, DsyChatHeader, DsyChatBubble, DsyChatFooter],\n  template: `\n    <dsy-chat position=\"start\"\n      ><dsy-chat-header>Alex <time>12:45</time></dsy-chat-header\n      ><dsy-chat-bubble>Ready to review?</dsy-chat-bubble\n      ><dsy-chat-footer>Delivered</dsy-chat-footer></dsy-chat\n    >\n  `,\n})\nexport class ChatUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
