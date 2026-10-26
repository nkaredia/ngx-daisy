import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'dropdown',
  entryPoint: '@ngx-daisy/cdk/dropdown',
  summary: 'Open a contextual action menu or a small nonmodal content panel.',
  usage: [
    'Use menu mode for commands and navigation items. Use kind="content" for forms, preferences and other arbitrary controls; do not attach dsyDropdownItem in content mode.',
  ],
  angular: [
    'Import the trigger, content-template and item directives alongside DsyDropdown. Use one button trigger and one ng-template. opened is a two-way model; triggered is the item action event. Template content is created when opened and destroyed when closed, so keep persistent application state outside the panel.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'The panel is portalled outside its original ancestors. Use panelClass with global styles or utilities; ancestor descendant selectors do not cross the overlay. Inherited theme tokens, typography and direction are copied.',
  ],
  accessibility: [
    'Menu mode supports arrow keys, Home/End, typeahead and Enter/Space. Escape returns focus to the trigger. Label the panel and use content mode for native Tab navigation through form controls.',
  ],
  apiNotes: [
    {
      name: 'open(focus), close(restoreFocus), toggle()',
      description:
        'Open with first/last item focus or false. Selection and Escape restore trigger focus; outside pointer/focus closes without stealing focus.',
    },
    {
      name: 'triggered',
      description:
        'DsyDropdownItem emits when an enabled item is activated. Disabled items are skipped by keyboard navigation.',
    },
  ],
  files: [
    {
      path: 'dropdown-example.ts',
      language: 'typescript',
      content:
        'import { Component, signal } from \'@angular/core\';\nimport {\n  DsyDropdown,\n  DsyDropdownTrigger,\n  DsyDropdownContent,\n  DsyDropdownItem,\n} from \'@ngx-daisy/cdk/dropdown\';\n\n@Component({\n  selector: \'app-dropdown-example\',\n  imports: [DsyDropdown, DsyDropdownTrigger, DsyDropdownContent, DsyDropdownItem],\n  template: `\n    <dsy-dropdown aria-label="Project actions">\n      <button type="button" dsyDropdownTrigger>Actions</button>\n      <ng-template dsyDropdownContent>\n        <button dsyDropdownItem (triggered)="message.set(\'Editing project\')">\n          Edit project\n        </button>\n        <a dsyDropdownItem href="/projects">All projects</a>\n      </ng-template>\n    </dsy-dropdown>\n    <p role="status">{{ message() }}</p>\n  `,\n})\nexport class DropdownUsageExample {\n  readonly message = signal(\'\');\n}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
