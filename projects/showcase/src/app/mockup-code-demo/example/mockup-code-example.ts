import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyMockupCode, DsyCodeLine } from '@ngx-daisy/cdk/mockup-code';

interface CodeLineValues {
  readonly prefix?: ReturnType<DsyCodeLine['prefix']>;
}

@Component({
  selector: 'demo-mockup-code-example',
  standalone: true,
  imports: [DsyMockupCode, DsyCodeLine],
  templateUrl: './mockup-code-example.html',
  styleUrl: './mockup-code-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupCodeExample {
  readonly values = input<readonly [Record<string, never>?, CodeLineValues?]>([]);
  readonly line = computed<CodeLineValues>(() => this.values()[1] ?? {});
}
