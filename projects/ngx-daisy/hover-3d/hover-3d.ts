import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  inject,
  ElementRef,
  booleanAttribute,
  signal,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-hover-3d, [dsyHover3d]',
  template: `<div class="dsy-hover-3d-content"><ng-content /></div>
    @for (zone of zones; track zone) {
      <div class="dsy-hover-3d-zone" aria-hidden="true"></div>
    }`,

  styleUrl: './hover-3d.scss',
  host: {
    '[class]': 'daisy("hover-3d")',
    '(pointermove)': 'move($event)',
    '(pointerleave)': 'reset()',
    '[attr.data-disabled]': 'disabled()',
    '[style.--shine]': 'disabled() ? "100% 100%" : shine()',
    '[style.--shadow]': 'disabled() ? "0rem 0rem 0rem" : (-y()) + "rem " + x() + "rem 1rem"',
    '[style.--transform]': 'disabled() ? "0, 0" : x() + ", " + y()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyHover3d {
  readonly daisy = injectDaisyUIClasses();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly shine = signal('100% 100%');
  readonly zones = [1, 2, 3, 4, 5, 6, 7, 8];
  readonly x = signal(0);
  readonly y = signal(0);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  move(e: PointerEvent) {
    if (this.disabled() || e.pointerType === 'touch') return;
    const r = this.el.nativeElement.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.shine.set(
      ((e.clientX - r.left) / r.width) * 200 -
        50 +
        '% ' +
        (((e.clientY - r.top) / r.height) * 200 - 50) +
        '%',
    );
    this.x.set((0.5 - (e.clientY - r.top) / r.height) * 1);
    this.y.set(((e.clientX - r.left) / r.width - 0.5) * 1);
  }
  reset() {
    this.x.set(0);
    this.y.set(0);
  }
}
