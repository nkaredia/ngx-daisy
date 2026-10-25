import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import { defineDaisyTheme, DsyThemeDefinition } from '@ngx-daisy/cdk/theme';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly saved = signal<readonly DsyThemeDefinition[]>([]);
  readonly active = signal<DsyThemeDefinition | null>(null);
  readonly message = signal('');
  readonly styles = computed(() => {
    const theme = this.active();
    return theme ? { ...theme.tokens, 'color-scheme': theme.colorScheme } : {};
  });
  constructor() {
    afterNextRender(() => {
      try {
        const raw = localStorage.getItem('ngx-daisy.custom-themes.v1');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!Array.isArray(data.themes)) throw new Error('Invalid saved themes');
        this.saved.set(data.themes.map((value: DsyThemeDefinition) => defineDaisyTheme(value)));
        this.active.set(this.saved().find((theme) => theme.name === data.active) ?? null);
      } catch {
        this.message.set(
          'Saved themes could not be loaded. You can still create and export a theme.',
        );
      }
    });
  }
  save(theme: DsyThemeDefinition) {
    const value = defineDaisyTheme(theme);
    this.saved.update((themes) => [...themes.filter((item) => item.name !== value.name), value]);
    if (this.active()?.name === value.name) this.active.set(value);
    this.persist('Theme saved in this browser.');
  }
  apply(theme: DsyThemeDefinition | null) {
    if (theme) this.save(theme);
    this.active.set(theme ? defineDaisyTheme(theme) : null);
    this.persist(
      theme ? 'Theme applied to all showcase pages.' : 'Using the standard showcase theme.',
    );
  }
  activate(name: string) {
    const theme = this.saved().find((item) => item.name === name);
    if (!theme) return;
    this.active.set(theme);
    this.persist('Custom theme applied to all showcase pages.');
  }
  remove(name: string) {
    this.saved.update((themes) => themes.filter((theme) => theme.name !== name));
    if (this.active()?.name === name) this.active.set(null);
    this.persist('Theme removed.');
  }
  private persist(message: string) {
    try {
      localStorage.setItem(
        'ngx-daisy.custom-themes.v1',
        JSON.stringify({ themes: this.saved(), active: this.active()?.name }),
      );
      this.message.set(message);
    } catch {
      this.message.set(
        'Theme is available for this session, but browser storage is unavailable. Export it to keep a copy.',
      );
    }
  }
}
