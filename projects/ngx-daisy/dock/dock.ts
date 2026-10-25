import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
  ElementRef,
  DestroyRef,
  Renderer2,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-dock, nav[dsyDock]',
  standalone: true,
  host: { '[class]': 'classes()', role: 'navigation', '[attr.aria-label]': 'label()' },
  template: `<ng-content />`,
  styleUrl: './dock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyDock {
  readonly daisy = injectDaisyUIClasses();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly label = input('Primary');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'dock',
        { xs: 'dock-xs', sm: 'dock-sm', md: 'dock-md', lg: 'dock-lg', xl: 'dock-xl' }[this.size()],
      ].filter(Boolean),
    ),
  );
}
@Directive({
  selector: 'button[dsyDockItem], a[dsyDockItem]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'disabled()?"true":null',
    '[attr.disabled]': 'element.tagName==="BUTTON"&&disabled()?"":null',
    '[attr.tabindex]': 'disabled()?-1:null',
    '[attr.aria-current]': 'active()?"page":null',
  },
})
export class DsyDockItem {
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
  readonly classes = computed(() =>
    this.daisy(...['', this.active() ? 'dock-active' : ''].filter(Boolean)),
  );
}
@Directive({ selector: '[dsyDockLabel]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyDockLabel {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['dock-label', ''].filter(Boolean)));
}
