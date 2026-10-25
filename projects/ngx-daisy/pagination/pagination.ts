import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  output,
  computed,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyJoin, DsyJoinItem } from '@ngx-daisy/cdk/join';
export interface DsyPageEvent {
  pageIndex: number;
  previousPageIndex: number;
  pageSize: number;
  length: number;
}
@Component({
  selector: 'dsy-pagination',
  imports: [DsyButton, DsyJoin, DsyJoinItem],
  template: `<nav [attr.aria-label]="label()">
    <dsy-join
      ><button
        dsyButton
        dsyJoinItem
        type="button"
        [size]="size()"
        [disabled]="disabled() || index() === 0"
        [attr.aria-label]="previousLabel()"
        (click)="go(index() - 1)"
      >
        ‹
      </button>
      @for (page of pages(); track page.key) {
        @if (page.index === null) {
          <span class="dsy-pagination-gap" aria-hidden="true">…</span>
        } @else {
          <button
            dsyButton
            dsyJoinItem
            type="button"
            [size]="size()"
            [color]="page.index === index() ? 'primary' : 'neutral'"
            [disabled]="disabled()"
            [attr.aria-current]="page.index === index() ? 'page' : null"
            [attr.aria-label]="pageLabel() + ' ' + (page.index + 1)"
            (click)="go(page.index)"
          >
            {{ page.index + 1 }}
          </button>
        }
      }
      <button
        dsyButton
        dsyJoinItem
        type="button"
        [size]="size()"
        [disabled]="disabled() || index() === pageCount() - 1"
        [attr.aria-label]="nextLabel()"
        (click)="go(index() + 1)"
      >
        ›
      </button></dsy-join
    >
  </nav>`,
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyPagination {
  readonly pageIndex = model(0);
  readonly pageSize = input(10, { transform: numberAttribute });
  readonly length = input(0, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly label = input('Pagination');
  readonly previousLabel = input('Previous page');
  readonly nextLabel = input('Next page');
  readonly pageLabel = input('Page');
  readonly pageChange = output<DsyPageEvent>();
  readonly safeSize = computed(() =>
    Number.isFinite(this.pageSize()) ? Math.max(1, Math.floor(this.pageSize())) : 10,
  );
  readonly safeLength = computed(() =>
    Number.isFinite(this.length()) ? Math.max(0, Math.floor(this.length())) : 0,
  );
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.safeLength() / this.safeSize())));
  readonly index = computed(() =>
    Math.max(0, Math.min(this.pageCount() - 1, Math.floor(this.pageIndex()) || 0)),
  );
  readonly pages = computed(() => {
    const count = this.pageCount(),
      current = this.index(),
      values = new Set([0, count - 1, current - 1, current, current + 1]);
    const sorted = [...values].filter((v) => v >= 0 && v < count).sort((a, b) => a - b);
    const pages: { key: string; index: number | null }[] = [];
    sorted.forEach((value, i) => {
      if (i && value - sorted[i - 1] > 1) pages.push({ key: 'gap-' + value, index: null });
      pages.push({ key: 'page-' + value, index: value });
    });
    return pages;
  });
  go(index: number) {
    if (this.disabled()) return;
    const next = Math.max(0, Math.min(this.pageCount() - 1, index)),
      previous = this.index();
    if (next === previous) return;
    this.pageIndex.set(next);
    this.pageChange.emit({
      pageIndex: next,
      previousPageIndex: previous,
      pageSize: this.safeSize(),
      length: this.safeLength(),
    });
  }
}
