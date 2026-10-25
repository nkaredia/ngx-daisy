import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyTooltip } from 'ngx-daisy/tooltip';
import { injectDaisyUIClasses } from 'ngx-daisy/config';

interface ExampleValues {
  readonly text?: ReturnType<DsyTooltip['text']>;
  readonly disabled?: ReturnType<DsyTooltip['disabled']>;
  readonly opened?: ReturnType<DsyTooltip['opened']>;
  readonly position?: ReturnType<DsyTooltip['position']>;
  readonly align?: ReturnType<DsyTooltip['align']>;
  readonly color?: ReturnType<DsyTooltip['color']>;
  readonly tooltipClass?: ReturnType<DsyTooltip['tooltipClass']>;
  readonly showDelay?: ReturnType<DsyTooltip['showDelay']>;
  readonly hideDelay?: ReturnType<DsyTooltip['hideDelay']>;
}

@Component({
  selector: 'demo-tooltip-example',
  standalone: true,
  imports: [DsyTooltip],
  templateUrl: './tooltip-example.html',
  styleUrl: './tooltip-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TooltipExample {
  readonly buttonClasses = injectDaisyUIClasses()('btn', 'btn-outline');
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly externalOpened = computed(() => this.props().opened ?? false);
  readonly opened = signal(false);
  constructor() {
    effect(() => this.opened.set(this.externalOpened()));
  }
}
