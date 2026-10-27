import { DSY_NATIVE_FIELD } from '@ngx-daisy/native/form-field';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  signal,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { Color } from '@nativescript/core';
import { DsyTheme, DSY_LIGHT_THEME, resolveNativeTheme } from '@ngx-daisy/native/theme';
import type { FormCheckboxControl } from '@angular/forms/signals';
import type { DsyButtonColor } from '@ngx-daisy/core/button';
import type { PropertyChangeData, Switch } from '@nativescript/core';
/** Native OS switch with the Angular Signal Forms checkbox contract. */
@Component({
  selector: 'Switch[dsyToggle]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[checked]': 'checked()',
    '[isEnabled]': '!disabled() && !readonly() && !hidden()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    '[accessibilityLabel]': 'accessibleLabel()',
    '[accessibilityHint]': 'accessibleDescription()',
    '[class]': 'classes()',
    '(loaded)': 'onLoaded()',
    '(unloaded)': 'nativeIOS.set(null)',
    '(checkedChange)': 'onCheckedChange($event)',
  },
})
export class DsyToggle implements FormCheckboxControl {
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  private readonly context = inject(DSY_NATIVE_FIELD, { optional: true });
  readonly accessibleLabel = computed(() => this.label() || this.context?.label() || 'Toggle');
  readonly accessibleDescription = computed(
    () => this.description() || this.context?.description() || '',
  );
  readonly color = input<DsyButtonColor>('primary', { alias: 'dsyColor' });
  readonly touch = output<void>();
  private readonly element = inject<ElementRef<Switch>>(ElementRef);
  private readonly theme = inject(DsyTheme, { optional: true });
  protected readonly nativeIOS = signal<{ onTintColor: unknown } | null>(null);
  private readonly platform = signal<'ios' | 'android' | null>(null);

  constructor() {
    effect(() => {
      const native = this.nativeIOS();
      if (!native) return;
      const tokens = this.theme?.resolved().tokens ?? resolveNativeTheme(DSY_LIGHT_THEME).tokens;
      // UISwitch owns its moving thumb and off track. NativeScript's generic
      // background setter clips the iOS 26 glass animation, so only tint the on track.
      native.onTintColor = new Color(tokens[`--color-${this.color() ?? 'primary'}`]).ios;
    });
  }

  protected onLoaded(): void {
    const native = this.element.nativeElement.ios;
    this.platform.set(native ? 'ios' : 'android');
    this.nativeIOS.set(native ?? null);
  }

  protected readonly classes = computed(() =>
    [
      'dsy-native-toggle',
      this.platform() === 'android' ? 'dsy-native-toggle-android' : '',
      this.checked() ? 'dsy-native-toggle-checked' : '',
      `dsy-native-toggle-${this.color() ?? 'primary'}`,
      this.disabled() ? 'dsy-native-toggle-disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  focus(): void {
    if (!this.disabled() && !this.readonly() && !this.hidden()) this.element.nativeElement.focus();
  }
  protected onCheckedChange(raw: unknown): void {
    const event = raw as PropertyChangeData;
    if (typeof event.value !== 'boolean' || event.value === this.checked()) return;
    if (this.disabled() || this.readonly() || this.hidden()) {
      (event.object as Switch).checked = this.checked();
      return;
    }
    this.checked.set(event.value);
    this.touch.emit();
  }
}
