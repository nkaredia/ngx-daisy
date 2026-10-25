import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DSY_THEME_TOKENS, defineDaisyTheme, exportDaisyTheme, DsyThemeDefinition } from './theme';
import { DsyTheme } from './theme.directive';

const theme = defineDaisyTheme({
  name: 'brand',
  colorScheme: 'light',
  default: true,
  prefersDark: false,
  tokens: Object.fromEntries(
    DSY_THEME_TOKENS.map((token) => [
      token,
      token.startsWith('--color-')
        ? '#123456'
        : ['--depth', '--noise'].includes(token)
          ? '0'
          : '1rem',
    ]),
  ) as DsyThemeDefinition['tokens'],
});

@Component({
  imports: [DsyTheme],
  template:
    '<section [dsyTheme]="theme()" data-theme="original" style="--color-primary: red !important; padding: 5px"><div data-theme="dark">Nested scope</div></section>',
})
class Host {
  readonly theme = signal<DsyThemeDefinition | null>(theme);
}

describe('Custom themes', () => {
  it('exports all native tokens and default options without depending on the DOM', () => {
    const css = exportDaisyTheme(theme);
    expect(css).toContain('@plugin "daisyui/theme"');
    expect(css).toContain('name: "brand";');
    expect(css).toContain('default: true;');
    expect(css).toContain('prefersdark: false;');
    for (const token of DSY_THEME_TOKENS)
      expect(css).toContain(`${token}: ${theme.tokens[token]};`);
    expect(Object.isFrozen(theme.tokens)).toBe(true);
  });
  it('rejects incomplete themes and declaration injection', () => {
    expect(() => defineDaisyTheme({ ...theme, name: 'bad"name' })).toThrow();
    expect(() =>
      defineDaisyTheme({ ...theme, tokens: {} as DsyThemeDefinition['tokens'] }),
    ).toThrow();
    expect(() =>
      defineDaisyTheme({
        ...theme,
        tokens: { ...theme.tokens, '--color-primary': 'red; display:none' },
      }),
    ).toThrow();
    expect(() =>
      defineDaisyTheme({ ...theme, tokens: { ...theme.tokens, '--depth': '2' } }),
    ).toThrow();
  });
  it('updates a scope and restores owned styles and attributes when removed', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    expect(host.dataset['theme']).toBe('brand');
    expect(host.style.getPropertyValue('--color-primary')).toBe('#123456');
    expect(host.querySelector('div')?.dataset['theme']).toBe('dark');
    fixture.componentInstance.theme.set({ ...theme, name: 'night-brand', colorScheme: 'dark' });
    await fixture.whenStable();
    expect(host.dataset['theme']).toBe('night-brand');
    expect(host.style.colorScheme).toBe('dark');
    fixture.componentInstance.theme.set(null);
    await fixture.whenStable();
    expect(host.dataset['theme']).toBe('original');
    expect(host.style.getPropertyValue('--color-primary')).toBe('red');
    expect(host.style.getPropertyPriority('--color-primary')).toBe('important');
    expect(host.style.getPropertyValue('--radius-box')).toBe('');
    expect(host.style.padding).toBe('5px');
  });
});
