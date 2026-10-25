import {
  Component,
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
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { DsyIdGenerator } from 'ngx-daisy/overlay';
@Component({
  selector: 'dsy-collapse',
  hostDirectives: [CdkAccordionItem],
  imports: [NgTemplateOutlet],
  template: `@if (trigger() === 'button') {
      <div [class]="daisy('collapse-title') + ' dsy-collapse-button-heading ' + titleClass()">
        <div class="dsy-collapse-header">
          <span>{{ title() }}</span
          ><ng-content select="[dsyCollapseHeader]" />
        </div>
        @if (triggerTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template"
            [ngTemplateOutletContext]="{ $implicit: this }"
          />
        } @else {
          <button
            type="button"
            class="dsy-collapse-trigger dsy-collapse-default-trigger"
            [id]="id + '-trigger'"
            [disabled]="disabled()"
            [attr.aria-expanded]="opened()"
            [attr.aria-controls]="id + '-panel'"
            (click)="toggle()"
          >
            {{ opened() ? closeLabel() : openLabel() }}
          </button>
        }
      </div>
    } @else {
      <h3 class="dsy-collapse-heading">
        <button
          type="button"
          [class]="daisy('collapse-title') + ' ' + titleClass()"
          [id]="id + '-trigger'"
          [disabled]="disabled()"
          [attr.aria-expanded]="opened()"
          [attr.aria-controls]="id + '-panel'"
          (click)="toggle()"
        >
          {{ title() }}<ng-content select="[dsyCollapseTitle]" />
        </button>
      </h3>
    }
    <div
      [id]="id + '-panel'"
      [class]="daisy('collapse-content') + ' ' + contentClass()"
      role="region"
      [attr.aria-labelledby]="id + '-trigger'"
      [hidden]="!contentVisible()"
      [attr.aria-hidden]="opened() ? null : 'true'"
      [attr.inert]="opened() ? null : ''"
    >
      <ng-content />
    </div>`,
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
  readonly triggerTemplate = input<TemplateRef<{ $implicit: DsyCollapse }> | null>(null);
  readonly trigger = input<'title' | 'button'>('title');
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
