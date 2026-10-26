import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'theme-controller',
  entryPoint: '@ngx-daisy/cdk/theme-controller',
  summary: 'Choose a daisyUI theme with a native checkbox or radio control.',
  usage: [
    'Use a checkbox to enable an alternate theme or a named radio group for mutually exclusive choices. Enable the theme names in the application stylesheet before using them.',
  ],
  angular: [
    'dsyThemeController takes a theme name and synchronizes the native value attribute and property. Native checked, disabled, name and Angular forms accessors remain available. The directive does not persist or install themes. Explicit nested data-theme scopes keep their own appearance.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'The selected theme must exist in compiled CSS. The native theme-controller class is exempt from Tailwind’s namespace, while daisyUI’s configured prefix still applies.',
  ],
  accessibility: [
    'Provide a label for each choice and a group legend for radio choices. Coordinate checked controllers so conflicting theme rules do not compete on the same CSS root.',
  ],
  apiNotes: [
    {
      name: 'changed',
      description:
        'Emits { theme, checked } on native change. Use it to update scoped state or application persistence.',
    },
    {
      name: 'CSS scope',
      description:
        'The checked controller changes the configured daisyUI root through :has. Place it inside a configured scoped root. theme-controller uses the daisyUI prefix but not Tailwind’s namespace.',
    },
  ],
  files: [
    {
      path: 'theme-controller-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyThemeController } from \'@ngx-daisy/cdk/theme-controller\';\n\n@Component({\n  selector: \'app-theme-controller-example\',\n  imports: [DsyThemeController],\n  template: `\n    <fieldset>\n      <legend>Color theme</legend>\n      <label\n        ><input type="radio" name="theme" dsyThemeController="light" checked />\n        Light</label\n      >\n      <label><input type="radio" name="theme" dsyThemeController="dark" /> Dark</label>\n    </fieldset>\n  `,\n})\nexport class ThemeControllerUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
