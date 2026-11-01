import { nativeThemeCss } from './theme-source';
import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { nativeThemes } from './themes';
import { Utils } from '@nativescript/core';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsyInput } from '@ngx-daisy/native/input';
import { DsySelect } from '@ngx-daisy/native/select';
import { DsyToggle } from '@ngx-daisy/native/toggle';
import { DsyBadge } from '@ngx-daisy/native/badge';
import { DsyProgress } from '@ngx-daisy/native/progress';
import { DsyAlert } from '@ngx-daisy/native/alert';
import {
  DsyTheme,
  DSY_THEME_TOKENS,
  defineDaisyTheme,
  resolveNativeTheme,
  type DsyThemeDefinition,
  type DsyThemeToken,
} from '@ngx-daisy/native/theme';
@Component({
  selector: 'dsy-native-theme-editor',
  standalone: true,
  imports: [DsyButton, DsyInput, DsySelect, DsyToggle, DsyBadge, DsyProgress, DsyAlert, DsyTheme],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './theme-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeThemeEditor {
  readonly theme = input.required<DsyThemeDefinition>();
  readonly width = input(360);
  readonly applied = output<DsyThemeDefinition>();
  readonly name = signal('custom');
  readonly scheme = signal<'light' | 'dark'>('light');
  readonly tokens = signal({} as Record<DsyThemeToken, string>);
  readonly defaultTheme = signal(false);
  readonly prefersDark = signal(false);
  readonly error = signal('');
  readonly feedback = signal('');
  readonly importText = signal('');
  readonly importOpen = signal(false);
  readonly groups = [
    {
      label: 'Base colors',
      description: 'Surfaces and the text that sits on them.',
      tokens: DSY_THEME_TOKENS.filter((token) => token.startsWith('--color-base-')),
    },
    {
      label: 'Brand colors',
      description: 'Your primary, secondary, accent and neutral palette.',
      tokens: DSY_THEME_TOKENS.filter((token) =>
        /^--color-(primary|secondary|accent|neutral)/.test(token),
      ),
    },
    {
      label: 'Status colors',
      description: 'Information, success, warning and error feedback.',
      tokens: DSY_THEME_TOKENS.filter((token) =>
        /^--color-(info|success|warning|error)/.test(token),
      ),
    },
    {
      label: 'Shape and size',
      description: 'Radius, control sizing and borders.',
      tokens: DSY_THEME_TOKENS.filter((token) => /^--(radius|size|border)/.test(token)),
    },
    {
      label: 'Effects',
      description: 'Depth and noise options, retained in the exported daisyUI theme.',
      tokens: DSY_THEME_TOKENS.filter((token) => token === '--depth' || token === '--noise'),
    },
  ];
  readonly schemes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];
  readonly switches = [
    { value: '0', label: 'Off' },
    { value: '1', label: 'On' },
  ];
  readonly draft = computed(() => {
    try {
      const theme = this.definition();
      resolveNativeTheme(theme);
      return theme;
    } catch {
      return this.theme();
    }
  });
  readonly previewTokens = computed(() => resolveNativeTheme(this.draft()).tokens);
  colorChip(token: DsyThemeToken): string {
    return this.previewTokens()[token] ?? 'transparent';
  }
  constructor() {
    effect(() => this.load(this.theme()));
  }
  private load(theme: DsyThemeDefinition): void {
    this.name.set(
      nativeThemes.some((preset) => preset.name === theme.name) ? 'custom' : theme.name,
    );
    this.scheme.set(theme.colorScheme);
    this.tokens.set({ ...theme.tokens });
    this.defaultTheme.set(theme.default ?? false);
    this.prefersDark.set(theme.prefersDark ?? false);
    this.error.set('');
    this.feedback.set('');
  }
  setToken(token: DsyThemeToken, value: string): void {
    if (this.tokens()[token] !== value)
      this.tokens.update((tokens) => ({ ...tokens, [token]: value }));
  }
  setScheme(value: string): void {
    if (value === 'light' || value === 'dark') this.scheme.set(value);
  }
  label(token: string): string {
    return token.replace(/^--/, '');
  }
  definition(): DsyThemeDefinition {
    return defineDaisyTheme({
      name: this.name(),
      colorScheme: this.scheme(),
      default: this.defaultTheme(),
      prefersDark: this.prefersDark(),
      tokens: this.tokens(),
    });
  }
  reset(): void {
    this.load(this.theme());
  }
  save(): void {
    try {
      const theme = this.definition();
      if (nativeThemes.some((preset) => preset.name === theme.name))
        throw new Error('Choose a custom name so the built-in preset stays available.');
      resolveNativeTheme(theme);
      this.applied.emit(theme);
      this.error.set('');
      this.feedback.set('Theme applied and saved.');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Check the theme values.');
    }
  }
  copy(format: 'json' | 'css'): void {
    try {
      const theme = this.definition();
      resolveNativeTheme(theme);
      const source = format === 'json' ? JSON.stringify(theme, null, 2) : nativeThemeCss(theme);
      Utils.copyToClipboard(source);
      this.error.set('');
      this.feedback.set(`Copied ${format.toUpperCase()} theme.`);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Check the theme values.');
    }
  }
  importTheme(): void {
    try {
      const theme = defineDaisyTheme(JSON.parse(this.importText()));
      resolveNativeTheme(theme);
      this.load(theme);
      this.name.set(theme.name);
      this.feedback.set('Theme imported. Review the preview, then apply.');
      this.importOpen.set(false);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Paste a valid JSON theme.');
    }
  }
}
