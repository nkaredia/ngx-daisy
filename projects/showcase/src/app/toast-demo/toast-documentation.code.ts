import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'toast',
  entryPoint: '@ngx-daisy/cdk/toast',
  summary: 'Deliver nonmodal notifications through an application service and a themed outlet.',
  usage: [
    'Use a single outlet in the application shell. Important messages should remain available until dismissed; optional positive durations expire with hover/focus pausing.',
  ],
  angular: [
    'Inject DsyToastService and call show(text, options). It returns an ID for dismiss(id); clear() removes all messages. Render one DsyToastOutlet per queue to avoid duplicates. Notifications do not take focus.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use outlet placement, toastClass, dismissButtonClass and dismissLabel for the notification stack. The outlet remains in its surrounding theme scope.',
  ],
  accessibility: [
    'CDK LiveAnnouncer announces new messages while outlet alerts avoid duplicate announcements. Keep manual dismissal available and avoid timers for essential information.',
  ],
  apiNotes: [
    {
      name: 'show(text, options)',
      description:
        'Returns an ID. Options include color, duration in milliseconds and announcement. No duration means the message persists.',
    },
    {
      name: 'dismiss(id), clear(), pause(id, reason), resume(id, reason)',
      description:
        'Control the service queue and overlapping pause reasons. Service destruction clears timers.',
    },
  ],
  files: [
    {
      path: 'toast-example.ts',
      language: 'typescript',
      content:
        "import { Component, inject } from '@angular/core';\nimport { DsyToastOutlet, DsyToastService } from '@ngx-daisy/cdk/toast';\n\n@Component({\n  selector: 'app-toast-example',\n  imports: [DsyToastOutlet],\n  template: `\n    <button type=\"button\" (click)=\"toasts.show('Project saved', { color: 'success' })\">\n      Show notification\n    </button>\n    <dsy-toast-outlet horizontal=\"end\" vertical=\"bottom\" />\n  `,\n})\nexport class ToastUsageExample {\n  readonly toasts = inject(DsyToastService);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
