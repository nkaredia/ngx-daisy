import type { DsyThemeDefinition } from '@ngx-daisy/core/theme';
/** Serialize an already validated portable theme for daisyUI's public plugin API. */
export function nativeThemeCss(theme: DsyThemeDefinition): string {
  return `@plugin "daisyui/theme" {\n  name: "${theme.name}";\n  default: ${theme.default ?? false};\n  prefersdark: ${theme.prefersDark ?? false};\n  color-scheme: ${theme.colorScheme};\n${Object.entries(
    theme.tokens,
  )
    .map(([token, value]) => `  ${token}: ${value};`)
    .join('\n')}\n}`;
}
