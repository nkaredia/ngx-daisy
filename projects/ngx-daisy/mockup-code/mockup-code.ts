import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-mockup-code, [dsyMockupCode]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './mockup-code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyMockupCode {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['mockup-code', ''].filter(Boolean)));
}
@Directive({
  selector: 'pre[dsyCodeLine]',
  standalone: true,
  host: { '[class]': 'classes()', '[attr.data-prefix]': 'prefix()' },
})
export class DsyCodeLine {
  readonly daisy = injectDaisyUIClasses();
  readonly prefix = input('>', { alias: 'dsyCodeLine' });
  readonly classes = computed(() => this.daisy(...['', ''].filter(Boolean)));
}
