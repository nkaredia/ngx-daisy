import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/native/button';
import {
  defineDaisyTheme,
  resolveNativeTheme,
  type DsyThemeDefinition,
} from '@ngx-daisy/native/theme';
@Component({
  selector: 'dsy-native-theme-editor',
  standalone: true,
  imports: [DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<StackLayout>
    <Label
      text="Make it yours"
      class="text-[28px] font-bold mb-3"
      accessibilityRole="header"
    ></Label>
    <Label
      text="Start with any preset, then customize its primary color, secondary color and field radius. Changes apply throughout the native showcase."
      class="opacity-75 mb-5"
      textWrap="true"
    ></Label>
    <Label text="Primary color" class="font-semibold mb-2"></Label>
    <TextField
      [text]="primary()"
      (textChange)="primary.set($any($event).value)"
      autocorrect="false"
      autocapitalizationType="none"
      accessibilityLabel="Primary color"
      class="bg-base-200 rounded-field p-3 mb-4"
    ></TextField>
    <Label text="Secondary color" class="font-semibold mb-2"></Label>
    <TextField
      [text]="secondary()"
      (textChange)="secondary.set($any($event).value)"
      autocorrect="false"
      autocapitalizationType="none"
      accessibilityLabel="Secondary color"
      class="bg-base-200 rounded-field p-3 mb-4"
    ></TextField>
    <Label text="Field radius" class="font-semibold mb-2"></Label>
    <TextField
      [text]="radius()"
      (textChange)="radius.set($any($event).value)"
      autocorrect="false"
      autocapitalizationType="none"
      accessibilityLabel="Field radius"
      class="bg-base-200 rounded-field p-3 mb-5"
    ></TextField>
    <Button dsyButton text="Apply theme" dsyColor="primary" (pressed)="save()"></Button>
    <Label
      [text]="error()"
      class="text-error mt-3"
      textWrap="true"
      accessibilityLiveRegion="polite"
    ></Label>
    <StackLayout class="bg-base-200 rounded-box p-5 mt-5"
      ><Label text="Your next big idea" class="text-xl font-bold mb-3"></Label
      ><Label
        text="A shared theme, from every screen to every action."
        class="opacity-75 mb-4"
        textWrap="true"
      ></Label
      ><Button dsyButton text="Get started" dsyColor="secondary"></Button
    ></StackLayout>
  </StackLayout>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeThemeEditor {
  readonly theme = input.required<DsyThemeDefinition>();
  readonly applied = output<DsyThemeDefinition>();
  readonly primary = signal('');
  readonly secondary = signal('');
  readonly radius = signal('');
  readonly error = signal('');
  constructor() {
    effect(() => {
      const theme = this.theme();
      this.primary.set(theme.tokens['--color-primary']);
      this.secondary.set(theme.tokens['--color-secondary']);
      this.radius.set(theme.tokens['--radius-field']);
    });
  }
  save(): void {
    try {
      const theme = defineDaisyTheme({
        ...this.theme(),
        name: 'custom',
        tokens: {
          ...this.theme().tokens,
          '--color-primary': this.primary(),
          '--color-secondary': this.secondary(),
          '--radius-field': this.radius(),
        },
      });
      resolveNativeTheme(theme);
      this.error.set('');
      this.applied.emit(theme);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Check the theme values.');
    }
  }
}
