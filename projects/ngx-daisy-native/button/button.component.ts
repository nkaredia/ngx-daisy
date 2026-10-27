import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
} from '@angular/core';
import type { EventData } from '@nativescript/core';
import type {
  DsyButtonColor,
  DsyButtonLayout,
  DsyButtonShape,
  DsyButtonSize,
  DsyButtonVariant,
} from '@ngx-daisy/core/button';
export type {
  DsyButtonColor,
  DsyButtonLayout,
  DsyButtonShape,
  DsyButtonSize,
  DsyButtonVariant,
} from '@ngx-daisy/core/button';

/** Native variants currently supported by the platform styling layer. */
export type DsyNativeButtonVariant = Exclude<DsyButtonVariant, 'dash'>;

/** A real NativeScript Button; its text property owns the native label. */
@Component({
  selector: 'Button[dsyButton]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[text]': 'displayText()',
    '[isEnabled]': '!isDisabled()',
    '[accessibilityLabel]': 'accessibleLabel()',
    '[accessibilityHint]': 'accessibilityHint()',
    '[accessibilityState]': 'isDisabled() ? "disabled" : active() ? "selected" : null',
    accessibilityRole: 'button',
    accessible: 'true',
    '[androidElevation]': '0',
    '(tap)': 'onTap($event)',
  },
})
export class DsyButton {
  readonly text = input('');
  /** Semantic palette; native `color` remains available for a literal foreground override. */
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly size = input<DsyButtonSize>('md');
  readonly variant = input<DsyNativeButtonVariant>('solid');
  readonly shape = input<DsyButtonShape>('normal');
  /** Avoid shadowing the native View.layout() method with a static attribute. */
  readonly layout = input<DsyButtonLayout>('auto', { alias: 'dsyLayout' });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingText = input('Loading…');
  readonly active = input(false, { transform: booleanAttribute });
  readonly accessibilityLabel = input<string>();
  readonly accessibilityHint = input('');
  /** Native activation, guarded while disabled or loading. */
  readonly pressed = output<EventData>();
  private readonly disabledSources = signal<readonly (() => boolean)[]>([]);
  /** Compose native interaction directives without competing isEnabled owners. */
  registerDisabledSource(source: () => boolean): () => void {
    this.disabledSources.update((sources) => [...sources, source]);
    return () =>
      this.disabledSources.update((sources) => sources.filter((value) => value !== source));
  }
  readonly isDisabled = computed(
    () => this.disabled() || this.loading() || this.disabledSources().some((source) => source()),
  );
  readonly displayText = computed(() => (this.loading() ? this.loadingText() : this.text()));
  readonly accessibleLabel = computed(() =>
    this.loading()
      ? `${this.accessibilityLabel() ?? this.text()}, ${this.loadingText()}`
      : (this.accessibilityLabel() ?? this.text()),
  );
  protected readonly classes = computed(() =>
    [
      'dsy-button',
      this.color() ? `dsy-button-${this.color()}` : '',
      `dsy-button-${this.size()}`,
      `dsy-button-${this.variant()}`,
      `dsy-button-${this.shape()}`,
      `dsy-button-${this.layout()}`,
      this.isDisabled() ? 'dsy-button-disabled' : '',
      this.active() ? 'dsy-button-active' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected onTap(event: unknown): void {
    // Angular types host events as DOM Events; the native renderer supplies EventData.
    if (!this.isDisabled()) this.pressed.emit(event as EventData);
  }
}
