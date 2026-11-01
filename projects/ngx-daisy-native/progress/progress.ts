import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import type { DsyButtonColor } from '@ngx-daisy/core/button';
/** OS-owned progress presentation; null represents an unknown amount of work. */
@Component({
  selector: 'GridLayout[dsyProgress]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    @if (safeValue() === null) {
      <ActivityIndicator
        busy="true"
        class="dsy-native-progress-busy"
        [class]="indicatorClass()"
        accessible="false"
        accessibilityHidden="true"
      />
    } @else {
      <Progress
        [maxValue]="safeMax()"
        [value]="safeValue()"
        class="dsy-native-progress-track"
        [class]="indicatorClass()"
        accessible="false"
        accessibilityHidden="true"
      ></Progress>
    }
  `,
  styleUrl: './progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    accessible: 'true',
    accessibilityRole: 'progressbar',
    '[accessibilityLabel]': 'label()',
    '[accessibilityValue]': 'accessibleValue()',
    isUserInteractionEnabled: 'false',
  },
})
export class DsyProgress {
  readonly value = input<number | null, string | number | null>(null, {
    transform: (value) => (value == null ? null : numberAttribute(value)),
  });
  readonly max = input(100, { transform: numberAttribute });
  readonly label = input('Progress');
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly indicatorClass = input('');
  readonly safeMax = computed(() =>
    Number.isFinite(this.max()) && this.max() > 0 ? this.max() : 100,
  );
  readonly safeValue = computed(() =>
    this.value() === null || !Number.isFinite(this.value())
      ? null
      : Math.max(0, Math.min(this.safeMax(), this.value()!)),
  );
  readonly accessibleValue = computed(() =>
    this.safeValue() === null
      ? 'In progress'
      : `${Math.round((this.safeValue()! / this.safeMax()) * 100)}%`,
  );
  readonly classes = computed(() =>
    ['dsy-native-progress', this.color() ? `dsy-native-progress-${this.color()}` : '']
      .filter(Boolean)
      .join(' '),
  );
}
