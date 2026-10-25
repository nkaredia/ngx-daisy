import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { DsyIndicator, DsyIndicatorItem } from '@ngx-daisy/cdk/indicator';
import { DsyButton } from '@ngx-daisy/cdk/button';

interface IndicatorItemValues {
  readonly horizontal?: ReturnType<DsyIndicatorItem['horizontal']>;
  readonly vertical?: ReturnType<DsyIndicatorItem['vertical']>;
}

@Component({
  selector: 'demo-indicator-example',
  standalone: true,
  imports: [DsyIndicator, DsyIndicatorItem, DsyButton],
  templateUrl: './indicator-example.html',
  styleUrl: './indicator-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IndicatorExample {
  readonly values = input<readonly [Record<string, never>?, IndicatorItemValues?]>([]);
  readonly item = computed<IndicatorItemValues>(() => this.values()[1] ?? {});
  readonly opened = signal(false);
  readonly toggle = (value: boolean) => !value;
}
