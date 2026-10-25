import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-mockup-phone, [dsyMockupPhone]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<div
      [class]="daisy('mockup-phone-camera') + ' ' + cameraClass()"
      aria-hidden="true"
    ></div>
    <div [class]="daisy('mockup-phone-display') + ' ' + displayClass()"><ng-content /></div>`,
  styleUrl: './mockup-phone.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyMockupPhone {
  readonly daisy = injectDaisyUIClasses();
  readonly displayClass = input('');
  readonly cameraClass = input('');
  readonly classes = computed(() => this.daisy(...['mockup-phone', ''].filter(Boolean)));
}
