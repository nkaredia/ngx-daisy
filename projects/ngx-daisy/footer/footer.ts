import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'footer[dsyFooter], dsy-footer',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyFooter {
  readonly daisy = injectDaisyUIClasses();
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly center = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'footer',
        { horizontal: 'footer-horizontal', vertical: 'footer-vertical' }[this.orientation()],
        this.center() ? 'footer-center' : '',
      ].filter(Boolean),
    ),
  );
}
@Directive({ selector: '[dsyFooterTitle]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyFooterTitle {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['footer-title', ''].filter(Boolean)));
}
