import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyStack } from '@ngx-daisy/cdk/stack';

interface StackValues {
  readonly position?: ReturnType<DsyStack['position']>;
}

@Component({
  selector: 'demo-stack-example',
  standalone: true,
  imports: [DsyStack],
  templateUrl: './stack-example.html',
  styleUrl: './stack-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StackExample {
  readonly values = input<readonly [StackValues?]>([]);
  readonly props = computed<StackValues>(() => this.values()[0] ?? {});
}
