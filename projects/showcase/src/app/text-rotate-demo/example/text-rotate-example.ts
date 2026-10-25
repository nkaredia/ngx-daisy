import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyTextRotate } from 'ngx-daisy/text-rotate';
export interface TextRotateExampleValues {
  readonly label?: ReturnType<DsyTextRotate['label']>;
  readonly duration?: ReturnType<DsyTextRotate['duration']>;
  readonly running?: ReturnType<DsyTextRotate['running']>;
}
@Component({
  selector: 'demo-text-rotate-example',
  standalone: true,
  imports: [DsyTextRotate],
  templateUrl: './text-rotate-example.html',
  styleUrl: './text-rotate-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TextRotateExample {
  readonly values = input<readonly TextRotateExampleValues[]>([]);
  readonly props = computed<TextRotateExampleValues>(() => this.values()[0] ?? {});
  readonly words = ['accessible', 'flexible', 'beautiful'];
}
