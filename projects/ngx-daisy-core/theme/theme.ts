/** The native daisyUI 5 theme contract. Tokens retain their names with CSS prefixes. */
export const DSY_THEME_TOKENS = [
  '--color-base-100',
  '--color-base-200',
  '--color-base-300',
  '--color-base-content',
  '--color-primary',
  '--color-primary-content',
  '--color-secondary',
  '--color-secondary-content',
  '--color-accent',
  '--color-accent-content',
  '--color-neutral',
  '--color-neutral-content',
  '--color-info',
  '--color-info-content',
  '--color-success',
  '--color-success-content',
  '--color-warning',
  '--color-warning-content',
  '--color-error',
  '--color-error-content',
  '--radius-selector',
  '--radius-field',
  '--radius-box',
  '--size-selector',
  '--size-field',
  '--border',
  '--depth',
  '--noise',
] as const;
export type DsyThemeToken = (typeof DSY_THEME_TOKENS)[number];
export interface DsyThemeDefinition {
  readonly name: string;
  readonly colorScheme: 'light' | 'dark';
  readonly default?: boolean;
  readonly prefersDark?: boolean;
  readonly tokens: Readonly<Record<DsyThemeToken, string>>;
}

/** Checks the serializable contract; CSS color/length support is browser-dependent. */
export function defineDaisyTheme(theme: DsyThemeDefinition): DsyThemeDefinition {
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(theme.name))
    throw new Error(
      'Theme names must start with a letter and contain only letters, numbers, underscores or hyphens.',
    );
  if (!['light', 'dark'].includes(theme.colorScheme))
    throw new Error('Choose a light or dark color scheme.');
  for (const flag of [theme.default, theme.prefersDark])
    if (flag !== undefined && typeof flag !== 'boolean')
      throw new Error('Theme options must be booleans.');
  const tokens = {} as Record<DsyThemeToken, string>;
  for (const token of DSY_THEME_TOKENS) {
    const value = theme.tokens?.[token];
    if (typeof value !== 'string' || !value.trim() || /[;{}<>\\\r\n]|\/\*|\*\//.test(value))
      throw new Error(`Invalid or missing value for ${token}.`);
    if ((token === '--depth' || token === '--noise') && !['0', '1'].includes(value))
      throw new Error(`${token} must be 0 or 1.`);
    tokens[token] = value.trim();
  }
  return Object.freeze({
    name: theme.name,
    colorScheme: theme.colorScheme,
    default: theme.default ?? false,
    prefersDark: theme.prefersDark ?? false,
    tokens: Object.freeze(tokens),
  });
}
