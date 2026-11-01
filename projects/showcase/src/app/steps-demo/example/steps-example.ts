import { LucideSparkles } from '@lucide/angular';
import { LucideCheck } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsySteps, DsyStep, DsyStepIcon } from '@ngx-daisy/cdk/steps';

interface StepsValues {
  readonly orientation?: ReturnType<DsySteps['orientation']>;
}

interface StepValues {
  readonly color?: ReturnType<DsyStep['color']>;
  readonly current?: ReturnType<DsyStep['current']>;
}

@Component({
  selector: 'demo-steps-example',
  standalone: true,
  imports: [LucideSparkles, LucideCheck, DsySteps, DsyStep, DsyStepIcon],
  templateUrl: './steps-example.html',
  styleUrl: './steps-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StepsExample {
  readonly values = input<readonly [StepsValues?, StepValues?, Record<string, never>?]>([]);
  readonly props = computed<StepsValues>(() => this.values()[0] ?? {});
  readonly step = computed<StepValues>(() => this.values()[1] ?? {});
}
