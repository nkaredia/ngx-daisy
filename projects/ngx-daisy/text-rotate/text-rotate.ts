import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-text-rotate',
  template: `<span class="dsy-text-rotate-label">{{ label() || visibleItems().join(', ') }}</span
    ><span
      [class]="daisy('text-rotate')"
      aria-hidden="true"
      [attr.data-running]="running()"
      [style.--duration]="duration() + 'ms'"
      ><span aria-hidden="true">
        @for (item of visibleItems(); track $index) {
          <span>{{ item }}</span>
        }
      </span></span
    >`,
  styleUrl: './text-rotate.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyTextRotate {
  readonly daisy = injectDaisyUIClasses();
  readonly items = input<readonly string[]>([]);
  readonly visibleItems = computed(() => this.items().slice(0, 6));
  readonly label = input('');
  readonly duration = input(10000, { transform: numberAttribute });
  readonly running = input(true, { transform: booleanAttribute });
}
