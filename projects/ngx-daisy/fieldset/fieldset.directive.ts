import { Directive } from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Directive({ selector: 'fieldset[dsyFieldset]', standalone: true, host: { '[class]': 'classes' } })
export class DsyFieldset {
  protected readonly classes = injectDaisyUIClasses()('fieldset');
}
@Directive({ selector: 'legend[dsyLegend]', standalone: true, host: { '[class]': 'classes' } })
export class DsyLegend {
  protected readonly classes = injectDaisyUIClasses()('fieldset-legend');
}

@Directive({ selector: '[dsyFieldsetLabel]', standalone: true, host: { '[class]': 'classes' } })
export class DsyFieldsetLabel {
  protected readonly classes = injectDaisyUIClasses()('fieldset-label');
}
