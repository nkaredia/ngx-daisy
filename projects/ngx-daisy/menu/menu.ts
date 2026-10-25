import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  computed,
  inject,
  ElementRef,
  DestroyRef,
  Renderer2,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'ul[dsyMenu], ol[dsyMenu]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyMenu {
  readonly daisy = injectDaisyUIClasses();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly paged = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'menu',
        { xs: 'menu-xs', sm: 'menu-sm', md: 'menu-md', lg: 'menu-lg', xl: 'menu-xl' }[this.size()],
        { horizontal: 'menu-horizontal', vertical: 'menu-vertical' }[this.orientation()],
        this.paged() ? 'menu-paged' : '',
      ].filter(Boolean),
    ),
  );
}
@Directive({
  selector: 'a[dsyMenuItem], button[dsyMenuItem]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'disabled()?"true":null',
    '[attr.disabled]': 'element.tagName==="BUTTON"&&disabled()?"":null',
    '[attr.tabindex]': 'disabled()?-1:null',
    '[attr.aria-current]': 'active()?"page":null',
  },
})
export class DsyMenuItem {
  readonly daisy = injectDaisyUIClasses();
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
  readonly focused = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      ...[
        '',
        this.active() ? 'menu-active' : '',
        this.disabled() ? 'menu-disabled' : '',
        this.focused() ? 'menu-focus' : '',
      ].filter(Boolean),
    ),
  );
}
@Directive({ selector: '[dsyMenuTitle]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyMenuTitle {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['menu-title', ''].filter(Boolean)));
}
@Directive({
  selector: '[dsyMenuDropdown]',
  standalone: true,
  host: { '[class]': 'classes()', '[attr.inert]': 'opened() === false ? "" : null' },
})
export class DsyMenuDropdown {
  readonly opened = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value == null ? undefined : booleanAttribute(value)),
  });
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() =>
    this.daisy(...['menu-dropdown', this.opened() ? 'menu-dropdown-show' : ''].filter(Boolean)),
  );
}
@Directive({
  selector: '[dsyMenuDropdownToggle]',
  standalone: true,
  host: { '[class]': 'classes()', '[attr.aria-expanded]': 'opened() ?? null' },
})
export class DsyMenuDropdownToggle {
  readonly opened = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value == null ? undefined : booleanAttribute(value)),
  });
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() =>
    this.daisy(
      ...['menu-dropdown-toggle', this.opened() ? 'menu-dropdown-show' : ''].filter(Boolean),
    ),
  );
}
@Directive({
  selector: 'details[dsyMenuSubmenu]',
  host: { '[attr.open]': 'opened()?"":null', '(toggle)': 'opened.set(element.open)' },
})
export class DsyMenuSubmenu {
  readonly opened = model(false);
  readonly element = inject<ElementRef<HTMLDetailsElement>>(ElementRef).nativeElement;
}
