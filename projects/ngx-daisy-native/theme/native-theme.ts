import Color from 'colorjs.io';
import { defineDaisyTheme, type DsyThemeDefinition } from '@ngx-daisy/core/theme';

/** CSS rem values use this reference size; native lengths are density-independent units. */
export interface DsyNativeThemeOptions {
  readonly rootFontSize?: number;
}

export interface DsyNativeTheme {
  readonly name: string;
  readonly colorScheme: 'light' | 'dark';
  readonly tokens: Readonly<Record<string, string>>;
}

/** Convert web design tokens to values understood by NativeScript, before applying any styles. */
export function resolveNativeTheme(
  theme: DsyThemeDefinition,
  options: DsyNativeThemeOptions = {},
): DsyNativeTheme {
  const definition = defineDaisyTheme(theme);
  const rootFontSize = options.rootFontSize ?? 16;
  if (!Number.isFinite(rootFontSize) || rootFontSize <= 0)
    throw new Error('rootFontSize must be a positive finite number.');
  const tokens: Record<string, string> = {};
  for (const [name, value] of Object.entries(definition.tokens)) {
    if (name.startsWith('--color-')) {
      const color = new Color(value).to('srgb').toGamut({ space: 'srgb' });
      const channels = color.coords.map((channel) => Math.round((channel ?? 0) * 255));
      tokens[name] = `rgba(${channels.join(', ')}, ${color.alpha})`;
    } else if (name === '--depth' || name === '--noise') {
      tokens[name] = value;
    } else {
      const match = /^(\d+(?:\.\d+)?|\.\d+)(rem|px|dip)?$/.exec(value);
      if (!match) throw new Error(`${name} requires a non-negative number, rem, px or dip value.`);
      const length = Number(match[1]) * (match[2] === 'rem' ? rootFontSize : 1);
      if (!Number.isFinite(length)) throw new Error(`${name} must resolve to a finite length.`);
      tokens[name] = String(length);
    }
  }
  tokens['--dsy-native-overlay-shadow'] =
    definition.colorScheme === 'dark'
      ? '0 8 24 rgba(0, 0, 0, 0.5), 0 2 6 rgba(0, 0, 0, 0.3)'
      : '0 8 24 rgba(0, 0, 0, 0.22), 0 2 6 rgba(0, 0, 0, 0.12)';
  // NativeScript cannot evaluate CSS color-mix; derive the soft variant surface once per theme.
  for (const name of [
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ]) {
    const mixed = new Color(definition.tokens['--color-base-100'])
      .mix(definition.tokens[`--color-${name}` as keyof typeof definition.tokens], 0.08, {
        space: 'oklab',
      })
      .to('srgb')
      .toGamut({ space: 'srgb' });
    const channels = mixed.coords.map((channel) => Math.round((channel ?? 0) * 255));
    tokens[`--dsy-color-${name}-soft`] = `rgba(${channels.join(', ')}, ${mixed.alpha})`;
  }
  // Darken the existing surface without mixing in its contrasting label color.
  for (const name of [
    'base-100',
    'base-200',
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ]) {
    for (const soft of name.startsWith('base-') ? [false] : [false, true]) {
      const source = soft ? `--dsy-color-${name}-soft` : `--color-${name}`;
      const color = new Color(tokens[source]).to('srgb');
      const channels = color.coords.map((channel) => Math.round((channel ?? 0) * 255 * 0.88));
      tokens[`--dsy-color-${name}${soft ? '-soft' : ''}-pressed`] =
        `rgba(${channels.join(', ')}, ${color.alpha})`;
    }
  }
  const fieldSize = Number(tokens['--size-field']);
  for (const [size, multiplier] of Object.entries({ xs: 6, sm: 8, md: 12, lg: 14, xl: 16 })) {
    const length = String(Math.max(44, fieldSize * multiplier));
    tokens[`--dsy-button-size-${size}`] = length;
    tokens[`--dsy-field-size-${size}`] = length;
  }
  return Object.freeze({
    name: definition.name,
    colorScheme: definition.colorScheme,
    tokens: Object.freeze(tokens),
  });
}
