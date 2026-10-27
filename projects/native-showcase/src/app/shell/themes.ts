import definitions from 'daisyui/theme/object';
import order from 'daisyui/functions/themeOrder';
import { DSY_THEME_TOKENS, defineDaisyTheme, type DsyThemeDefinition } from '@ngx-daisy/core/theme';
/** Reuse daisyUI's published theme data; never import its browser CSS in the native app. */
export const nativeThemes = order.map((name) => {
  const definition = definitions[name as keyof typeof definitions];
  return defineDaisyTheme({
    name,
    colorScheme: definition['color-scheme'] as 'light' | 'dark',
    tokens: Object.fromEntries(
      DSY_THEME_TOKENS.map((token) => [token, definition[token]]),
    ) as DsyThemeDefinition['tokens'],
  });
});
