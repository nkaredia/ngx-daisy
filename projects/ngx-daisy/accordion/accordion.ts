import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { CdkAccordion } from '@angular/cdk/accordion';
@Component({
  selector: 'dsy-accordion',
  template: '<ng-content />',
  hostDirectives: [{ directive: CdkAccordion, inputs: ['multi'] }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyAccordion {
  private readonly accordion = inject(CdkAccordion);
  openAll() {
    this.accordion.openAll();
  }
  closeAll() {
    this.accordion.closeAll();
  }
}
