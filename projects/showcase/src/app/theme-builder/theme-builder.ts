import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  DsyTheme,
  DsyThemeDefinition,
  DsyThemeToken,
  DSY_THEME_TOKENS,
  defineDaisyTheme,
  exportDaisyTheme,
} from '@ngx-daisy/cdk/theme';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyInput } from '@ngx-daisy/cdk/input';
import { DsyToggle } from '@ngx-daisy/cdk/toggle';
import { ExampleCode } from '../playground/example-code';
import { PlaygroundSourceFile } from '../playground/playground.types';
import { ThemeStore } from './theme-store';
import presets from './presets.json';
import { DOCUMENT, NgStyle } from '@angular/common';
import { daisyThemes, DaisyThemeName } from './showcase-themes';
import { DsyRange } from '@ngx-daisy/cdk/range';
import { ThemePreview } from './theme-preview';
import { DsyModal } from '@ngx-daisy/cdk/modal';
import {
  LucideDynamicIcon,
  LucidePlus,
  LucideShuffle,
  LucideCode,
  LucideLayoutGrid,
  LucideList,
  LucidePalette,
  LucideX,
} from '@lucide/angular';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgStyle,
    DsyRange,
    ThemePreview,
    DsyModal,
    LucideDynamicIcon,
    LucidePlus,
    LucideShuffle,
    LucideCode,
    LucideX,
    DsyTheme,
    DsyButton,
    DsyInput,
    DsyToggle,
    ExampleCode,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'demo-theme-builder',
  styleUrl: './theme-builder.scss',
  templateUrl: './theme-builder.html',
})
export class ThemeBuilder {
  private readonly document = inject(DOCUMENT);
  readonly store = inject(ThemeStore);
  readonly isCurrentTheme = (theme: DsyThemeDefinition) => theme.name === this.draft().name;
  readonly presets = daisyThemes;
  readonly preset = signal<DaisyThemeName>('light');
  readonly selectedTheme = signal('daisy:light');
  readonly view = signal<'demo' | 'variants' | 'palette'>('demo');
  readonly exportOpened = signal(false);
  readonly views = [
    { id: 'demo', label: 'Components Demo', icon: LucideLayoutGrid },
    { id: 'variants', label: 'Component Variants', icon: LucideList },
    { id: 'palette', label: 'Color Palette', icon: LucidePalette },
  ] as const;
  readonly radii = [
    { key: '--radius-box', title: 'Boxes', description: 'card, modal, alert' },
    { key: '--radius-field', title: 'Fields', description: 'button, input, select, tab' },
    { key: '--radius-selector', title: 'Selectors', description: 'checkbox, toggle, badge' },
  ] as const;
  readonly radiusValues = ['0rem', '0.25rem', '0.5rem', '1rem', '2rem'];
  readonly sizes = [
    {
      key: '--size-field',
      title: 'Fields',
      description: 'button, input, select, tab',
      factors: [6, 8, 10, 12, 14],
    },
    {
      key: '--size-selector',
      title: 'Selectors',
      description: 'checkbox, toggle, badge',
      factors: [4, 5, 6, 7, 8],
    },
  ] as const;
  readonly colorGroups = computed(() => [
    { name: 'base', tokens: this.colors.slice(0, 4) },
    ...this.semantics.map((name) => ({
      name,
      tokens: this.colors.filter(
        (key) => key === `--color-${name}` || key === `--color-${name}-content`,
      ),
    })),
  ]);
  readonly draft = signal<DsyThemeDefinition>(
    defineDaisyTheme(presets.light as DsyThemeDefinition),
  );
  readonly preview = signal(this.draft());
  readonly error = signal('');
  readonly colors = DSY_THEME_TOKENS.filter((token) => token.startsWith('--color-'));
  /** Only the native picker's sRGB swatch is converted; authored OKLCH values stay intact. */
  readonly pickerColors = computed(() => {
    const result: Partial<Record<DsyThemeToken, string>> = {};
    const canvas = this.document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context =
      typeof CanvasRenderingContext2D === 'undefined'
        ? null
        : canvas.getContext('2d', { willReadFrequently: true });
    for (const token of this.colors) {
      if (!context) {
        result[token] = '#000000';
        continue;
      }
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = this.preview().tokens[token];
      context.fillRect(0, 0, 1, 1);
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      result[token] = '#' + [r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('');
    }
    return result;
  });
  readonly dimensions = DSY_THEME_TOKENS.filter((token) => /--(radius|size|border)/.test(token));
  readonly semantics = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ] as const;
  readonly files = computed<readonly PlaygroundSourceFile[]>(() => [
    { path: 'theme.scss', language: 'scss', content: exportDaisyTheme(this.preview()) },
  ]);
  readonly usage = computed(
    () =>
      `<section data-theme="${this.preview().name}">\n  <button dsyButton color="primary">Save changes</button>\n</section>`,
  );
  label(token: string) {
    return token.replace('--color-', '').replace('--', '').replaceAll('-', ' ');
  }
  update(patch: Partial<DsyThemeDefinition>) {
    this.draft.update((theme) => ({ ...theme, ...patch }));
    try {
      const theme = defineDaisyTheme(this.draft());
      for (const token of DSY_THEME_TOKENS) {
        const property = token.startsWith('--color-')
          ? 'color'
          : /--(radius|size|border)/.test(token)
            ? 'width'
            : null;
        if (property && typeof CSS !== 'undefined' && !CSS.supports(property, theme.tokens[token]))
          throw new Error(
            `Enter a valid CSS ${property === 'color' ? 'color' : 'length'} for ${this.label(token)}.`,
          );
      }
      this.preview.set(theme);
      this.error.set('');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Invalid theme.');
    }
  }
  token(key: DsyThemeToken, value: string) {
    this.update({ tokens: { ...this.draft().tokens, [key]: value } });
  }
  startFrom(value: string) {
    if (!this.presets.includes(value as (typeof this.presets)[number])) return;
    this.preset.set(value as (typeof this.presets)[number]);
    this.selectedTheme.set(`daisy:${value}`);
    this.update({ ...(presets[this.preset()] as DsyThemeDefinition), name: value });
  }
  pixels(key: DsyThemeToken) {
    const value = this.preview().tokens[key];
    const numeric = Number.parseFloat(value);
    return value.endsWith('rem') ? numeric * 16 : numeric;
  }
  newTheme() {
    this.update({ name: `my-theme-${this.store.saved().length + 1}` });
    this.store.save(this.preview());
    this.selectedTheme.set(`custom:${this.preview().name}`);
  }
  randomize() {
    const hue = Math.floor(Math.random() * 360);
    const tokens = { ...this.draft().tokens };
    this.semantics.forEach((name, index) => {
      tokens[`--color-${name}`] = `oklch(65% 0.17 ${(hue + index * 43) % 360})`;
      tokens[`--color-${name}-content`] = 'oklch(15% 0.02 260)';
    });
    this.update({ tokens });
  }
  load(theme: DsyThemeDefinition) {
    this.selectedTheme.set(`custom:${theme.name}`);
    this.update(theme);
  }
  reset() {
    this.update(presets[this.preset()] as DsyThemeDefinition);
  }
}
