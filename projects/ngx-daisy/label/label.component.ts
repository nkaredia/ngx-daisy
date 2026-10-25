import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-label',
  standalone: true,
  template: '<ng-content/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyLabel {}
@Directive({
  selector: 'label[dsyLabel],span[dsyLabel]',
  standalone: true,
  host: { '[class]': 'classes' },
})
export class DsyNativeLabel {
  protected readonly classes = injectDaisyUIClasses()('label');
}
@Directive({
  selector: 'label[dsyFloatingLabel]',
  standalone: true,
  host: { '[class]': 'classes' },
})
export class DsyFloatingLabel {
  protected readonly classes = injectDaisyUIClasses()('floating-label');
}
