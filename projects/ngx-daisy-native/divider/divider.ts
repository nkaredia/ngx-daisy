import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import type { DsyButtonColor } from '@ngx-daisy/core/button';
/** Decorative separator; adjacent headings retain content semantics. */
@Component({
  selector: 'GridLayout[dsyDivider]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <StackLayout row="0" col="0" class="dsy-native-divider-line" [class]="lineClass()" />
    @if (text()) {
      <Label
        [row]="orientation() === 'vertical' ? 1 : 0"
        [col]="orientation() === 'vertical' ? 0 : 1"
        [text]="text()"
        class="dsy-native-divider-text"
        [class]="labelClass()"
      ></Label>
    }
    <StackLayout
      [row]="orientation() === 'vertical' ? 2 : 0"
      [col]="orientation() === 'vertical' ? 0 : 2"
      class="dsy-native-divider-line"
      [class]="lineClass()"
    />
  `,
  styleUrl: './divider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[rows]': 'rows()',
    '[columns]': 'columns()',
    accessible: 'false',
    accessibilityHidden: 'true',
    isUserInteractionEnabled: 'false',
  },
})
export class DsyDivider {
  readonly text = input('');
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly align = input<'center' | 'start' | 'end'>('center');
  /** Styling hooks for internal visual slots. */
  readonly lineClass = input('');
  readonly labelClass = input('');
  private readonly tracks = computed(() =>
    !this.text()
      ? '*, 0, 0'
      : this.align() === 'start'
        ? '16, auto, *'
        : this.align() === 'end'
          ? '*, auto, 16'
          : '*, auto, *',
  );
  readonly rows = computed(() => (this.orientation() === 'vertical' ? this.tracks() : 'auto'));
  readonly columns = computed(() => (this.orientation() === 'vertical' ? 'auto' : this.tracks()));
  readonly classes = computed(() =>
    [
      'dsy-native-divider',
      `dsy-native-divider-${this.orientation()}`,
      this.color() ? `dsy-native-divider-${this.color()}` : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
