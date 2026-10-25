import { Component, signal, viewChild, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DsyAccordion } from '@ngx-daisy/cdk/accordion';
import { DsyCollapse } from '@ngx-daisy/cdk/collapse';
import { DsyCarousel, DsyCarouselItem } from '@ngx-daisy/cdk/carousel';
import { DsyDiff } from '@ngx-daisy/cdk/diff';
import { DsyHoverGallery } from '@ngx-daisy/cdk/hover-gallery';
import { DsyCountdown } from '@ngx-daisy/cdk/countdown';
import { DsyTextRotate } from '@ngx-daisy/cdk/text-rotate';
import { DsyTableDataSource, DsySort, DsySortHeader } from '@ngx-daisy/cdk/table';
import { DsyChatBubble } from '@ngx-daisy/cdk/chat';
import { DsyStatus } from '@ngx-daisy/cdk/status';
import { DsyBadge } from '@ngx-daisy/cdk/badge';
import { DsyCard, DsyCardTitle } from '@ngx-daisy/cdk/card';
import { DsyTimeline, DsyTimelineEnd, DsyTimelineBox } from '@ngx-daisy/cdk/timeline';
import { provideDaisyUI } from '@ngx-daisy/cdk/config';

@Component({
  imports: [DsyAccordion, DsyCollapse],
  template: `<dsy-accordion [multi]="multi()" #group
    ><dsy-collapse title="First" [(opened)]="first"><a href="#details">Detail link</a></dsy-collapse
    ><dsy-collapse title="Second" [(opened)]="second">More details</dsy-collapse
    ><dsy-collapse title="Disabled" disabled>Unavailable</dsy-collapse></dsy-accordion
  >`,
})
class AccordionHost {
  readonly multi = signal(false);
  readonly first = signal(true);
  readonly second = signal(false);
  readonly group = viewChild.required(DsyAccordion);
}
@Component({
  imports: [DsyCarousel, DsyCarouselItem],
  template: `<dsy-carousel [(activeIndex)]="index" [loop]="loop()" [vertical]="vertical()">
    @for (item of slides(); track item) {
      <section dsyCarouselItem>
        <a href="#content">{{ item }}</a>
      </section>
    }
  </dsy-carousel>`,
})
class CarouselHost {
  readonly index = signal(0);
  readonly loop = signal(false);
  readonly vertical = signal(false);
  readonly slides = signal(['One', 'Two', 'Three']);
}
@Component({
  imports: [DsyDiff, DsyHoverGallery, DsyCountdown, DsyTextRotate],
  template: `<dsy-diff [(position)]="position" [disabled]="disabled()"
      ><div dsyDiffBefore>Before</div>
      <div dsyDiffAfter>After</div></dsy-diff
    ><dsy-hover-gallery
      [controls]="true"
      [images]="images()"
      [(activeIndex)]="image"
    /><dsy-countdown [value]="count()" /><dsy-text-rotate
      [items]="['Fast', 'Flexible']"
      label="Fast and flexible"
      [running]="false"
    />`,
})
class DisplayHost {
  readonly position = signal(50);
  readonly disabled = signal(false);
  readonly image = signal(0);
  readonly count = signal(12);
  readonly images = signal([
    { src: 'one.svg', alt: 'One' },
    { src: 'two.svg', alt: 'Two' },
  ]);
}
@Component({
  imports: [DsySort, DsySortHeader],
  template: `<table dsySort #sort="dsySort">
    <thead>
      <tr>
        <th dsySortHeader="name">Name</th>
        <th dsySortHeader="tasks">Tasks</th>
      </tr>
    </thead>
  </table>`,
})
class SortHost {
  readonly sort = viewChild.required(DsySort);
}
@Component({
  imports: [DsyBadge, DsyCard, DsyCardTitle, DsyTimeline, DsyTimelineEnd, DsyTimelineBox],
  template: `<dsy-badge color="success" variant="outline" size="lg">Ready</dsy-badge>
    <article dsyCard border="dash"><h3 dsyCardTitle>Title</h3></article>
    <ol dsyTimeline>
      <li><div dsyTimelineEnd dsyTimelineBox>Milestone</div></li>
    </ol>`,
})
class PrefixHost {}
async function render<T>(type: Type<T>) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return { fixture, host: fixture.componentInstance, root: fixture.nativeElement as HTMLElement };
}

describe('Data Display disclosures', () => {
  it('coordinates exclusive expansion through CDK and keeps labelled regions hidden when closed', async () => {
    const { fixture, host, root } = await render(AccordionHost);
    const buttons = root.querySelectorAll('button'),
      panels = root.querySelectorAll<HTMLElement>('[role=region]');
    expect(host.first()).toBe(true);
    expect(panels[0].hidden).toBe(false);
    expect(buttons[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(buttons[0].id);
    buttons[1].click();
    await fixture.whenStable();
    expect(host.first()).toBe(false);
    expect(host.second()).toBe(true);
    expect(panels[0].hidden).toBe(true);
    expect(panels[0].hasAttribute('inert')).toBe(true);
    expect(buttons[2].disabled).toBe(true);
    buttons[2].click();
    await fixture.whenStable();
    expect(host.second()).toBe(true);
  });
  it('supports multi-open commands and returns focus before closing a panel containing focus', async () => {
    const { fixture, host, root } = await render(AccordionHost);
    host.multi.set(true);
    await fixture.whenStable();
    host.group().openAll();
    await fixture.whenStable();
    expect(host.first()).toBe(true);
    expect(host.second()).toBe(true);
    const link = root.querySelector('a')!;
    link.focus();
    host.first.set(false);
    await fixture.whenStable();
    expect(document.activeElement).toBe(root.querySelector('button'));
    host.group().closeAll();
    await fixture.whenStable();
    expect(host.second()).toBe(false);
  });
});
describe('Data Display navigation', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });
  });
  it('navigates with buttons and keys, handles boundaries and makes inactive slides inert', async () => {
    const { fixture, host, root } = await render(CarouselHost);
    const carousel = root.querySelector<HTMLElement>('dsy-carousel')!,
      buttons = root.querySelectorAll('button'),
      slides = root.querySelectorAll('[dsyCarouselItem]');
    expect(buttons[0].disabled).toBe(true);
    expect(slides[0].hasAttribute('inert')).toBe(false);
    expect(slides[1].hasAttribute('inert')).toBe(true);
    buttons[1].click();
    await fixture.whenStable();
    expect(host.index()).toBe(1);
    carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(host.index()).toBe(2);
    expect(buttons[1].disabled).toBe(true);
    host.loop.set(true);
    await fixture.whenStable();
    buttons[1].click();
    await fixture.whenStable();
    expect(host.index()).toBe(0);
    expect(slides[0].getAttribute('aria-label')).toBe('1 of 3');
  });
  it('leaves nested keyboard controls alone and handles vertical and shrinking slide sets', async () => {
    const { fixture, host, root } = await render(CarouselHost);
    root
      .querySelector('a')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(host.index()).toBe(0);
    host.vertical.set(true);
    await fixture.whenStable();
    root
      .querySelector('dsy-carousel')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(host.index()).toBe(1);
    host.slides.set(['Only']);
    await fixture.whenStable();
    expect(root.querySelector('[dsyCarouselItem]')!.hasAttribute('inert')).toBe(false);
    expect(root.querySelectorAll('button')[1].disabled).toBe(true);
    host.slides.set([]);
    await fixture.whenStable();
    expect(root.querySelectorAll('button')[0].disabled).toBe(true);
  });
});
describe('Data Display values', () => {
  it('updates a comparison from a native range input and clamps external positions', async () => {
    const { fixture, host, root } = await render(DisplayHost);
    const range = root.querySelector('input')!;
    range.value = '75';
    range.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.position()).toBe(75);
    expect(range.getAttribute('aria-valuetext')).toBe('75% before');
    host.position.set(200);
    host.disabled.set(true);
    await fixture.whenStable();
    expect(range.value).toBe('100');
    expect(range.disabled).toBe(true);
  });
  it('selects gallery images with buttons and safely handles a shortened collection', async () => {
    const { fixture, host, root } = await render(DisplayHost);
    const buttons = root.querySelectorAll<HTMLButtonElement>('dsy-hover-gallery button');
    buttons[1].click();
    await fixture.whenStable();
    expect(host.image()).toBe(1);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelectorAll<HTMLImageElement>('img')[0].hidden).toBe(true);
    host.images.set([{ src: 'only.svg', alt: 'Only' }]);
    await fixture.whenStable();
    expect(root.querySelector<HTMLImageElement>('img')!.hidden).toBe(false);
  });
  it('clamps countdown values without starting a background timer', async () => {
    const { fixture, host, root } = await render(DisplayHost);
    host.count.set(1001);
    await fixture.whenStable();
    expect(root.querySelector('.dsy-countdown-label')!.textContent).toBe('999');
    host.count.set(-1);
    await fixture.whenStable();
    expect(root.querySelector('.dsy-countdown-label')!.textContent).toBe('0');
  });
});
describe('Rotating text accessibility', () => {
  it('provides one stable readable phrase while visual animation is hidden from assistive technology', async () => {
    const { root } = await render(DisplayHost);
    expect(root.querySelector('.dsy-text-rotate-label')!.textContent).toBe('Fast and flexible');
    expect(
      root.querySelector('dsy-text-rotate [aria-hidden=true]')!.getAttribute('data-running'),
    ).toBe('false');
  });
});

describe('CDK table integration', () => {
  it('filters, sorts numbers and paginates without mutating application data', () => {
    TestBed.runInInjectionContext(() => {
      const rows = [
        { name: 'Taylor', tasks: 20 },
        { name: 'Alex', tasks: 3 },
        { name: 'Sam', tasks: 11 },
      ];
      const source = new DsyTableDataSource(rows);
      source.pageSize.set(2);
      source.sort.set({ active: 'tasks', direction: 'asc' });
      expect(source.rows().map((r) => r.tasks)).toEqual([3, 11]);
      expect(rows.map((r) => r.tasks)).toEqual([20, 3, 11]);
      source.pageIndex.set(1);
      expect(source.rows().map((r) => r.tasks)).toEqual([20]);
      source.filter.set('  ALEX  ');
      expect(source.effectivePageIndex()).toBe(0);
      expect(source.filteredCount()).toBe(1);
      expect(source.rows()[0].name).toBe('Alex');
      source.filter.set('missing');
      expect(source.rows()).toEqual([]);
      expect(source.pageCount()).toBe(1);
    });
  });
  it('supports reactive custom predicates/accessors and disconnect/reconnect', async () => {
    const source = TestBed.runInInjectionContext(
      () => new DsyTableDataSource([{ person: { name: 'Sam' } }, { person: { name: 'Alex' } }]),
    );
    source.filterPredicate.set((row, filter) => row.person.name.toLowerCase().includes(filter));
    source.sortingDataAccessor.set((row) => row.person.name);
    source.sort.set({ active: 'person', direction: 'asc' });
    const received: readonly unknown[][] = [];
    const first = source.connect().subscribe((rows) => (received as unknown[][]).push([...rows]));
    TestBed.tick();
    expect(source.rows()[0].person.name).toBe('Alex');
    first.unsubscribe();
    source.disconnect();
    source.filter.set('sam');
    const second = source.connect().subscribe((rows) => (received as unknown[][]).push([...rows]));
    TestBed.tick();
    expect(source.rows().length).toBe(1);
    expect(received.length).toBeGreaterThan(0);
    second.unsubscribe();
  });
  it('cycles native sortable heading buttons and exposes aria-sort', async () => {
    const { fixture, host, root } = await render(SortHost);
    const headers = root.querySelectorAll('th'),
      button = headers[0].querySelector('button')!;
    button.click();
    await fixture.whenStable();
    expect(host.sort().active()).toBe('name');
    expect(headers[0].getAttribute('aria-sort')).toBe('ascending');
    button.click();
    await fixture.whenStable();
    expect(headers[0].getAttribute('aria-sort')).toBe('descending');
    button.click();
    await fixture.whenStable();
    expect(headers[0].getAttribute('aria-sort')).toBe('none');
  });
});
describe('Data Display customization', () => {
  it('preserves native elements and composes styling directives with both prefixes', async () => {
    TestBed.configureTestingModule({
      providers: [provideDaisyUI({ prefix: 'd-', tailwindPrefix: 'tw' })],
    });
    const { root } = await render(PrefixHost);
    const badge = root.querySelector('dsy-badge')!;
    expect(badge.classList.contains('tw:d-badge-success')).toBe(true);
    expect(badge.classList.contains('d-badge-outline')).toBe(true);
    expect(root.querySelector('article')!.classList.contains('tw:d-card-dash')).toBe(true);
    const milestone = root.querySelector('[dsyTimelineEnd]')!;
    expect(milestone.classList.contains('tw:d-timeline-end')).toBe(true);
    expect(milestone.classList.contains('tw:d-timeline-box')).toBe(true);
    expect(root.querySelector('h3')!.textContent).toBe('Title');
  });
});

@Component({
  imports: [DsyBadge, DsyChatBubble, DsyStatus],
  template: `<dsy-badge>Default</dsy-badge><dsy-badge color="neutral">Neutral</dsy-badge
    ><dsy-chat-bubble>Default</dsy-chat-bubble
    ><dsy-chat-bubble color="neutral">Neutral</dsy-chat-bubble><dsy-status /><dsy-status
      color="neutral"
    />`,
})
class DefaultColorsHost {}

describe('native daisyUI default colors', () => {
  it('keeps the base appearance when color is omitted and still supports explicit neutral', async () => {
    const fixture = TestBed.createComponent(DefaultColorsHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    for (const [selector, colorClass] of [
      ['dsy-badge', 'badge-neutral'],
      ['dsy-chat-bubble', 'chat-bubble-neutral'],
      ['dsy-status', 'status-neutral'],
    ]) {
      const items = root.querySelectorAll(selector);
      expect(items[0].classList.contains(colorClass)).toBe(false);
      expect(items[1].classList.contains(colorClass)).toBe(true);
    }
  });
});
