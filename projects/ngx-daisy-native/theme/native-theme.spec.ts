import { DSY_DARK_THEME, DSY_LIGHT_THEME, type DsyThemeDefinition } from '@ngx-daisy/core/theme';
import { resolveNativeTheme } from './native-theme';

function withToken(name: string, value: string): DsyThemeDefinition {
  return { ...DSY_LIGHT_THEME, tokens: { ...DSY_LIGHT_THEME.tokens, [name]: value } };
}

describe('Native theme adaptation', () => {
  it('converts built-in OKLCH colors and rem dimensions without changing source tokens', () => {
    const native = resolveNativeTheme(DSY_LIGHT_THEME);
    expect(native.tokens['--color-base-100']).toBe('rgba(255, 255, 255, 1)');
    expect(native.tokens['--radius-field']).toBe('4');
    expect(native.tokens['--radius-box']).toBe('8');
    expect(DSY_LIGHT_THEME.tokens['--radius-field']).toBe('0.25rem');
    expect(Object.isFrozen(native.tokens)).toBe(true);
    expect(resolveNativeTheme(DSY_DARK_THEME).colorScheme).toBe('dark');
  });

  it('preserves color alpha and maps out-of-gamut colors into native sRGB', () => {
    expect(
      resolveNativeTheme(withToken('--color-primary', 'rgb(255 0 0 / 50%)')).tokens[
        '--color-primary'
      ],
    ).toBe('rgba(255, 0, 0, 0.5)');
    const color = resolveNativeTheme(withToken('--color-primary', 'oklch(70% 0.4 150)')).tokens[
      '--color-primary'
    ];
    const channels = color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number);
    expect(channels.every((value) => value >= 0 && value <= 255)).toBe(true);
  });

  it('uses an explicit font reference for rem and treats px as design units', () => {
    expect(resolveNativeTheme(DSY_LIGHT_THEME, { rootFontSize: 20 }).tokens['--radius-field']).toBe(
      '5',
    );
    expect(resolveNativeTheme(withToken('--radius-box', '12px')).tokens['--radius-box']).toBe('12');
    expect(resolveNativeTheme(withToken('--radius-box', '12dip')).tokens['--radius-box']).toBe(
      '12',
    );
  });

  it('derives semantic soft surfaces and theme sizes with a 44-unit touch minimum', () => {
    const native = resolveNativeTheme(DSY_LIGHT_THEME);
    expect(native.tokens['--dsy-color-primary-soft']).not.toBe(native.tokens['--color-base-100']);
    expect(native.tokens['--dsy-color-primary-soft']).not.toBe(native.tokens['--color-primary']);
    expect(native.tokens['--dsy-button-size-xs']).toBe('44');
    expect(native.tokens['--dsy-button-size-md']).toBe('48');
    expect(
      resolveNativeTheme(withToken('--size-field', '0.5rem')).tokens['--dsy-button-size-md'],
    ).toBe('96');
  });

  it('rejects incompatible CSS expressions and invalid dimensions before applying a theme', () => {
    for (const value of ['calc(1rem + 2px)', '50%', '-1px', '1em'])
      expect(() => resolveNativeTheme(withToken('--radius-box', value))).toThrow();
    for (const rootFontSize of [0, -1, Infinity, NaN])
      expect(() => resolveNativeTheme(DSY_LIGHT_THEME, { rootFontSize })).toThrow();
    expect(() => resolveNativeTheme(withToken('--color-primary', 'var(--brand)'))).toThrow();
  });
});
