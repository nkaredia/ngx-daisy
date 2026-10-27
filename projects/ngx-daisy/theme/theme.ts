import { DSY_THEME_TOKENS, defineDaisyTheme, type DsyThemeDefinition } from '@ngx-daisy/core/theme';
export * from '@ngx-daisy/core/theme';

/** Paste after the daisyUI plugin in the application's global SCSS. */
export function exportDaisyTheme(theme: DsyThemeDefinition): string {
  const value = defineDaisyTheme(theme);
  return [
    '@plugin "daisyui/theme" {',
    `  name: "${value.name}";`,
    `  default: ${value.default};`,
    `  prefersdark: ${value.prefersDark};`,
    `  color-scheme: ${value.colorScheme};`,
    ...DSY_THEME_TOKENS.map((token) => `  ${token}: ${value.tokens[token]};`),
    '}',
  ].join('\n');
}
