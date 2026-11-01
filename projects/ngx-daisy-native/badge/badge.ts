import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import type { DsyButtonColor } from '@ngx-daisy/core/button';
/** Noninteractive status label. Use a Button for actionable chips. */
@Component({
  selector: 'Label[dsyBadge]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()', '[text]': 'text()', textWrap: 'true' },
})
export class DsyBadge {
  readonly text = input('');
  /** Avoid NativeScript's literal foreground color property. */
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly variant = input<'solid' | 'outline' | 'soft' | 'ghost'>('solid');
  readonly classes = computed(() =>
    [
      'dsy-native-badge',
      `dsy-native-badge-${this.size()}`,
      `dsy-native-badge-${this.variant()}`,
      this.color() ? `dsy-native-badge-${this.color()}` : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
