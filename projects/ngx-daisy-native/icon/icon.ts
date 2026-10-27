import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import type { DsyIconColor } from '@ngx-daisy/core/icon';
export type { DsyIconColor } from '@ngx-daisy/core/icon';
/** Projection only: apps own fonts, images and provider components. */
@Component({
  selector: 'GridLayout[dsyIcon]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '<ng-content />',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dsy-native-icon',
    '[class]': 'colorClass()',
    '[style.--dsy-native-icon-size]': 'iconSize()',
    '[width]': 'iconSize()',
    '[height]': 'iconSize()',
    '[accessibilityLabel]': 'accessibleLabel()',
    '[accessible]': '!!accessibleLabel()',
    '[accessibilityHidden]': '!accessibleLabel()',
    accessibilityRole: 'image',
  },
})
export class DsyIcon {
  readonly size = input(24);
  readonly color = input<DsyIconColor>('inherit', { alias: 'dsyColor' });
  readonly label = input<string>();
  readonly iconSize = computed(() =>
    Number.isFinite(this.size()) && this.size() > 0 ? this.size() : 24,
  );
  readonly accessibleLabel = computed(() => this.label()?.trim() || null);
  readonly colorClass = computed(() =>
    this.color() === 'inherit' ? '' : `dsy-native-icon-${this.color()}`,
  );
}
