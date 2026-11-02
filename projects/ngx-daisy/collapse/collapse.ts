import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  computed,
  inject,
  effect,
  ElementRef,
  booleanAttribute,
  TemplateRef,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import {
  ACCORDION_GROUP,
  AccordionGroup,
  AccordionTrigger,
  AccordionPanel,
  AccordionContent,
} from '@angular/aria/accordion';
import { DsyAccordion } from '@ngx-daisy/cdk/accordion';
import { DsyIdGenerator } from '@ngx-daisy/cdk/overlay';
/** Bridges the Angular logical view boundary without depending on Aria internals. */
@Directive({
  selector: '[dsyCollapseAriaContext]',
  providers: [
    {
      provide: ACCORDION_GROUP,
      useFactory: () => {
        const collapse = inject(DsyCollapse);
        return collapse.parentAccordion?.ariaGroup ?? collapse.localGroup();
      },
    },
  ],
})
class DsyCollapseAriaContext {}
@Component({
  selector: 'dsy-collapse',
  hostDirectives: [CdkAccordionItem],
  imports: [
    NgTemplateOutlet,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
    DsyCollapseAriaContext,
  ],
  templateUrl: './collapse.html',
  styleUrl: './collapse.scss',
  host: {
    '[class]': 'classes()',
    '[attr.data-opened]': 'opened()',
    '[attr.data-indicator]': 'indicator()',
    '(transitionend)': 'finishClose($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyCollapse {
  /** @internal Only standalone disclosures create a local keyboard group. */
  readonly parentAccordion = inject(DsyAccordion, { optional: true });
  readonly localGroup = viewChild.required(AccordionGroup);
  readonly triggerTemplate = input<TemplateRef<{ $implicit: DsyCollapse }> | null>(null);
  readonly trigger = input<'title' | 'button'>('title');
  readonly customTrigger = computed(() =>
    this.trigger() === 'button' ? this.triggerTemplate() : null,
  );
  readonly openLabel = input('Show details');
  readonly closeLabel = input('Hide details');
  readonly titleClass = input('');
  readonly contentClass = input('');
  readonly daisy = injectDaisyUIClasses();
  readonly id = inject(DsyIdGenerator).next('dsy-collapse');
  private readonly item = inject(CdkAccordionItem);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly title = input('');
  readonly opened = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly indicator = input<'arrow' | 'plus' | 'none'>('none');
  readonly contentVisible = signal(false);
  readonly classes = computed(() =>
    this.daisy(
      'collapse',
      this.opened() ? 'collapse-open' : 'collapse-close',
      { arrow: 'collapse-arrow', plus: 'collapse-plus', none: '' }[this.indicator()],
    ),
  );
  constructor() {
    effect((cleanup) => {
      const opened = this.opened();
      if (opened) {
        this.contentVisible.set(true);
        return;
      }
      if (!untracked(this.contentVisible)) return;
      const view = this.host.nativeElement.ownerDocument.defaultView;
      const reduced = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const style = view?.getComputedStyle(this.host.nativeElement);
      const durations = (style?.transitionDuration || '0s')
        .split(',')
        .map((value) => parseFloat(value) * (value.trim().endsWith('ms') ? 1 : 1000));
      const delays = (style?.transitionDelay || '0s')
        .split(',')
        .map((value) => parseFloat(value) * (value.trim().endsWith('ms') ? 1 : 1000));
      const duration = reduced
        ? 0
        : Math.max(0, ...durations.map((value, i) => value + delays[i % delays.length]));
      if (!duration) {
        this.contentVisible.set(false);
        return;
      }
      const timer = setTimeout(() => this.contentVisible.set(false), duration + 50);
      cleanup(() => clearTimeout(timer));
    });
    this.item.expandedChange.subscribe((v) => {
      if (!v) this.restoreFocus();
      this.opened.set(v);
    });
    effect(() => {
      this.item.disabled = this.disabled();
      if (!this.opened()) this.restoreFocus();
      this.item.expanded = this.opened();
    });
  }
  /** Keep panel editing and custom header controls outside the group's disclosure key map. */
  containInteraction(event: KeyboardEvent) {
    if (
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '].includes(event.key)
    )
      event.stopPropagation();
  }
  finishClose(event: TransitionEvent) {
    if (
      !this.opened() &&
      event.target === this.host.nativeElement &&
      event.propertyName === 'grid-template-rows'
    )
      this.contentVisible.set(false);
  }
  private restoreFocus() {
    const el = this.host.nativeElement;
    if (el.querySelector('[role=region]')?.contains(el.ownerDocument.activeElement))
      el.querySelector<HTMLElement>('[id="' + this.id + '-trigger"]')?.focus();
  }
  toggle() {
    if (!this.disabled()) this.opened.update((v) => !v);
  }
}
