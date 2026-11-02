import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject } from '@angular/core';
import { AccordionGroup } from '@angular/aria/accordion';
import { CdkAccordion } from '@angular/cdk/accordion';
@Component({
  selector: 'dsy-accordion',
  // Aria owns native-trigger interaction; CDK coordinates all expansion, including legacy templates.
  template: '<ng-content />',
  hostDirectives: [{ directive: CdkAccordion, inputs: ['multi'] }, AccordionGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyAccordion {
  /** @internal Interaction context for the library-owned disclosure triggers. */
  readonly ariaGroup = inject(AccordionGroup);
  private readonly accordion = inject(CdkAccordion);
  openAll() {
    this.accordion.openAll();
  }
  closeAll() {
    this.accordion.closeAll();
  }
}
