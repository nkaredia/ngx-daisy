import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  DsyButton,
  DsyButtonColor,
  DsyButtonLayout,
  DsyButtonShape,
  DsyButtonSize,
  DsyButtonVariant,
} from 'ngx-daisy/button';

export interface ButtonExampleValues {
  readonly color?: DsyButtonColor;
  readonly size?: DsyButtonSize;
  readonly variant?: DsyButtonVariant;
  readonly shape?: DsyButtonShape;
  readonly layout?: DsyButtonLayout;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly active?: boolean;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly tabIndex?: number;
}

@Component({
  imports: [DsyButton],
  selector: 'demo-button-example',
  templateUrl: './button-example.html',
  styleUrl: './button-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonExample {
  readonly values = input<readonly ButtonExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
}
