import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyCollapse } from '@ngx-daisy/cdk/collapse';
export interface CollapseExampleValues {
  readonly title?: ReturnType<DsyCollapse['title']>;
  readonly opened?: ReturnType<DsyCollapse['opened']>;
  readonly disabled?: ReturnType<DsyCollapse['disabled']>;
  readonly indicator?: ReturnType<DsyCollapse['indicator']>;
  readonly trigger?: ReturnType<DsyCollapse['trigger']>;
  readonly openLabel?: ReturnType<DsyCollapse['openLabel']>;
  readonly closeLabel?: ReturnType<DsyCollapse['closeLabel']>;
  readonly titleClass?: ReturnType<DsyCollapse['titleClass']>;
  readonly contentClass?: ReturnType<DsyCollapse['contentClass']>;
}
@Component({
  selector: 'demo-collapse-example',
  standalone: true,
  imports: [DsyCollapse],
  templateUrl: './collapse-example.html',
  styleUrl: './collapse-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CollapseExample {
  readonly values = input<readonly CollapseExampleValues[]>([]);
  readonly props = computed<CollapseExampleValues>(() => this.values()[0] ?? {});
}
