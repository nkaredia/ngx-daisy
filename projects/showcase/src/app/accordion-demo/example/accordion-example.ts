import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyAccordion } from 'ngx-daisy/accordion';
import { DsyCollapse } from 'ngx-daisy/collapse';
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
  selector: 'demo-accordion-example',
  standalone: true,
  imports: [DsyAccordion, DsyCollapse],
  templateUrl: './accordion-example.html',
  styleUrl: './accordion-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AccordionExample {
  readonly values = input<readonly [Record<string, never>?, CollapseExampleValues?]>([]);
  readonly props = computed<CollapseExampleValues>(() => this.values()[1] ?? {});
  readonly multi = signal(false);
}
