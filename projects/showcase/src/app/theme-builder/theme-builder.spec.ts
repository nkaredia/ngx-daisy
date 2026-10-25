import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ThemeBuilder } from './theme-builder';
import { ThemeStore } from './theme-store';
import presets from './presets.json';
import { DsyThemeDefinition, defineDaisyTheme } from '@ngx-daisy/cdk/theme';

describe('Theme Builder', () => {
  beforeEach(() => {
    localStorage.removeItem('ngx-daisy.custom-themes.v1');
    vi.stubGlobal('CSS', {
      supports: (_property: string, value: string) => value !== 'invalid-color',
    });
  });
  afterEach(() => {
    localStorage.removeItem('ngx-daisy.custom-themes.v1');
    vi.unstubAllGlobals();
  });

  it('keeps the last valid preview while editing an invalid value', async () => {
    const fixture = TestBed.createComponent(ThemeBuilder);
    await fixture.whenStable();
    const component = fixture.componentInstance;
    component.token('--color-primary', '#2463eb');
    component.token('--color-primary', 'invalid-color');
    expect(component.preview().tokens['--color-primary']).toBe('#2463eb');
    expect(component.error()).toContain('valid CSS color');
    component.token('--color-primary', '#ff0000');
    expect(component.error()).toBe('');
    expect(component.files()[0].content).toContain('--color-primary: #ff0000;');
  });

  it('saves, replaces, applies and removes named themes', async () => {
    const fixture = TestBed.createComponent(ThemeBuilder);
    await fixture.whenStable();
    const store = TestBed.inject(ThemeStore);
    const theme = presets.light as DsyThemeDefinition;
    store.apply(theme);
    store.save({ ...theme, tokens: { ...theme.tokens, '--color-primary': '#123456' } });
    expect(store.saved()).toHaveLength(1);
    expect(store.active()?.tokens['--color-primary']).toBe('#123456');
    expect(JSON.parse(localStorage.getItem('ngx-daisy.custom-themes.v1')!).active).toBe(theme.name);
    store.remove(theme.name);
    expect(store.saved()).toHaveLength(0);
    expect(store.active()).toBeNull();
  });

  it('restores a saved active theme after page initialization', async () => {
    localStorage.setItem(
      'ngx-daisy.custom-themes.v1',
      JSON.stringify({ themes: [presets.dark], active: presets.dark.name }),
    );
    const fixture = TestBed.createComponent(ThemeBuilder);
    await fixture.whenStable();
    expect(TestBed.inject(ThemeStore).active()?.colorScheme).toBe('dark');
  });
  it('loads every built-in preset and preserves the preset when editing its tokens', async () => {
    const fixture = TestBed.createComponent(ThemeBuilder);
    await fixture.whenStable();
    const component = fixture.componentInstance;
    for (const name of component.presets) {
      component.startFrom(name);
      expect(component.error()).toBe('');
      expect(defineDaisyTheme(component.preview()).tokens).toEqual(presets[name].tokens);
    }
    component.startFrom('dracula');
    component.token('--color-primary', '#123456');
    component.reset();
    expect(component.preview().tokens['--color-primary']).toBe(
      presets.dracula.tokens['--color-primary'],
    );
  });

  it('switches preview views without losing the edited theme and exports current values', async () => {
    const fixture = TestBed.createComponent(ThemeBuilder);
    await fixture.whenStable();
    const component = fixture.componentInstance;
    component.token('--color-primary', '#2463eb');
    for (const label of ['Color Palette', 'Component Variants', 'Components Demo']) {
      (fixture.nativeElement as HTMLElement)
        .querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!
        .click();
      await fixture.whenStable();
      expect(component.preview().tokens['--color-primary']).toBe('#2463eb');
    }
    component.newTheme();
    expect(component.store.saved().some((theme) => theme.name === component.preview().name)).toBe(
      true,
    );
    component.exportOpened.set(true);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="dialog"]')).not.toBeNull();
    expect(component.files()[0].content).toContain('--color-primary: #2463eb;');
  });
});
