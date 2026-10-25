import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  numberAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-countdown',
  template: `<span aria-hidden="true" [class]="daisy('countdown')"
      ><span [style.--value]="safeValue()" [style.--digits]="digits()">{{
        safeValue()
      }}</span></span
    ><span class="dsy-countdown-label">{{ safeValue() }}</span>`,
  styleUrl: './countdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyCountdown {
  readonly daisy = injectDaisyUIClasses();
  readonly value = input(0, { transform: numberAttribute });
  readonly digits = input<1 | 2 | 3>(1);
  readonly safeValue = computed(() =>
    Math.max(0, Math.min(999, Math.floor(Number.isFinite(this.value()) ? this.value() : 0))),
  );
}
