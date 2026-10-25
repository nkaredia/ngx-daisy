import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyIdGenerator } from '@ngx-daisy/cdk/overlay';
import { DSY_FAB } from './fab-context';
import { DsyFabAction, DsyFabTrigger } from './fab-parts';
export type DsyFabLayout = 'vertical' | 'flower';
export type DsyFabPosition = 'fixed' | 'absolute' | 'inline';
export type DsyFabCorner = 'start' | 'end';
@Component({
  selector: 'dsy-fab',
  standalone: true,
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_FAB, useExisting: forwardRef(() => DsyFab) }],
  host: {
    class: 'dsy-fab',
    '[class]': 'classes()',
    '[attr.data-opened]': 'opened()',
    '[attr.data-layout]': 'layout()',
    '[attr.data-position]': 'position()',
    '[attr.data-corner]': 'corner()',
    '[attr.data-replacement]': 'hasReplacement()',
    '[style.--dsy-fab-radius]': 'radius()',
    '(keydown)': 'keydown($event)',
    '(focusout)': 'focusout($event)',
    '(document:pointerdown)': 'outside($event)',
  },
})
export class DsyFab {
  readonly opened = model(false);
  readonly layout = input<DsyFabLayout>('vertical');
  readonly position = input<DsyFabPosition>('fixed');
  readonly corner = input<DsyFabCorner>('end');
  readonly radius = input<string>();
  readonly openOnFocus = input(false, { transform: booleanAttribute });
  readonly id = input(inject(DsyIdGenerator).next('dsy-fab-actions'));
  readonly label = input('Quick actions', { alias: 'aria-label' });
  readonly actions = contentChildren(DsyFabAction, { descendants: true });
  private readonly trigger = contentChild(DsyFabTrigger);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private manager?: FocusKeyManager<DsyFabAction>;
  private readonly daisyClasses = injectDaisyUIClasses();
  readonly hasActions = computed(() => this.actions().length > 0);
  readonly hasReplacement = computed(() =>
    this.actions().some((action) => action.kind !== 'action'),
  );
  protected readonly classes = computed(() =>
    this.daisyClasses('fab', ...(this.layout() === 'flower' ? ['fab-flower'] : [])),
  );
  constructor() {
    effect(() => {
      const actions = this.actions();
      if (actions.filter((action) => action.kind !== 'action').length > 1)
        throw new Error('dsy-fab supports one main action or close button, not both.');
      if (
        this.layout() === 'flower' &&
        actions.filter((action) => action.kind === 'action').length > 4
      )
        throw new Error('dsy-fab flower supports at most four action buttons.');
      this.manager?.destroy();
      this.manager = new FocusKeyManager(actions)
        .withWrap()
        .withVerticalOrientation()
        .withHorizontalOrientation('ltr')
        .withHomeAndEnd()
        .withTypeAhead();
    });
    inject(DestroyRef).onDestroy(() => this.manager?.destroy());
  }
  open(focus: false | 'first' | 'last' = false): void {
    if (!this.hasActions()) return;
    this.opened.set(true);
    if (focus || this.hasReplacement())
      afterNextRender(
        () => {
          if (!this.opened()) return;
          if (focus === 'last') this.manager?.setLastItemActive();
          else this.manager?.setFirstItemActive();
        },
        { injector: this.injector },
      );
  }
  close(restoreFocus = false): void {
    if (!this.opened()) return;
    this.opened.set(false);
    if (restoreFocus)
      afterNextRender(
        () => {
          const active = this.host.ownerDocument.activeElement;
          if (
            this.trigger()?.element.isConnected &&
            (active === this.host.ownerDocument.body || this.host.contains(active))
          )
            this.trigger()!.element.focus({ preventScroll: true });
        },
        { injector: this.injector },
      );
  }
  toggle(): void {
    if (this.opened()) this.close(true);
    else this.open();
  }
  angle(action: DsyFabAction): string {
    const actions = this.actions().filter((item) => item.kind === 'action');
    const index = actions.indexOf(action);
    const count = actions.length;
    return `${count === 1 ? 135 : count === 2 ? 165 - index * 60 : 180 - (index * 90) / Math.max(1, count - 1)}deg`;
  }
  activateItem(action: DsyFabAction): void {
    this.manager?.updateActiveItem(this.actions().indexOf(action));
  }
  protected keydown(event: KeyboardEvent): void {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (event.key === 'Escape' && this.opened()) {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
    } else if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
    ) {
      event.preventDefault();
      if (!this.opened())
        this.open(event.key === 'ArrowUp' || event.key === 'End' ? 'last' : 'first');
      else this.manager?.onKeydown(event);
    } else if (this.opened()) this.manager?.onKeydown(event);
  }
  protected outside(event: PointerEvent): void {
    if (!this.host.contains(event.target as Node)) this.close();
  }
  protected focusout(event: FocusEvent): void {
    if (event.relatedTarget && !this.host.contains(event.relatedTarget as Node)) this.close();
  }
}
