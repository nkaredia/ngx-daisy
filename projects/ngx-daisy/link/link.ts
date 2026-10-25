import {
  Directive,
  input,
  computed,
  inject,
  ElementRef,
  DestroyRef,
  Renderer2,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Directive({
  selector: 'a[dsyLink]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'disabled()?"true":null',
    '[attr.disabled]': 'element.tagName==="BUTTON"&&disabled()?"":null',
    '[attr.tabindex]': 'disabled()?-1:null',
    '[attr.aria-current]': 'active()?"page":null',
  },
})
export class DsyLink {
  readonly daisy = injectDaisyUIClasses();
  readonly color = input<
    | 'inherit'
    | 'neutral'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
  >('inherit');
  readonly hover = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly active = input(false, { transform: booleanAttribute });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  constructor() {
    const unlisten = inject(Renderer2).listen(
      this.element,
      'click',
      (event: Event) => {
        if (this.disabled()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
    inject(DestroyRef).onDestroy(unlisten);
  }
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'link',
        {
          inherit: '',
          neutral: 'link-neutral',
          primary: 'link-primary',
          secondary: 'link-secondary',
          accent: 'link-accent',
          info: 'link-info',
          success: 'link-success',
          warning: 'link-warning',
          error: 'link-error',
        }[this.color()],
        this.hover() ? 'link-hover' : '',
      ].filter(Boolean),
    ),
  );
}
