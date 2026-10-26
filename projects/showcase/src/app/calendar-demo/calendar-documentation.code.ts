import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'calendar',
  entryPoint: '@ngx-daisy/cdk/calendar',
  summary: 'Choose a single date from an inline month view.',
  usage: [
    'Use date bounds and dateFilter to express unavailable dates. Values are ISO date strings (YYYY-MM-DD), not Date objects or times. This is an inline single-date calendar, not a date-range picker.',
  ],
  angular: [
    'DsyDateAdapter provides date parsing, locale and formatting. The control follows Angular form state; configure constraints through a form schema where applicable. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'panelClass and dateClass customize the calendar surface and dates. Native DayPicker rdp-* parts retain provider names; they follow Tailwind’s namespace but skip daisyUI’s prefix.',
  ],
  accessibility: [
    'Provide a visible label or accessible name and associate supporting text with the control. Keep error messages available to assistive technology; do not communicate invalid state using color alone. Preserve native keyboard operation and a visible focus indicator.',
  ],
  apiNotes: [
    {
      name: 'focus(options?)',
      description: 'Focuses the field while preserving native input interaction.',
    },
    {
      name: 'Form state',
      description:
        'Native directives use Angular’s built-in accessors. Composed controls expose value and touch through Angular 22 custom-control integration; do not add a second value owner.',
    },
  ],
  files: [
    {
      path: 'calendar-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyCalendar } from '@ngx-daisy/cdk/calendar';\n\n@Component({\n  selector: 'app-calendar-example',\n  imports: [DsyCalendar, FormField],\n  template: `\n    <dsy-calendar [formField]=\"fields.value\" aria-label=\"Choose a booking date\" />\n  `,\n})\nexport class CalendarUsageExample {\n  readonly model = signal({ value: null as string | null });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
