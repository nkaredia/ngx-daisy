# Data Display

All 19 families from the installed daisyUI 5.7 catalog have standalone secondary entry points and dedicated lazy showcase routes. Import only the families an application uses. The root package remains empty. Appearance comes from daisyUI; Angular signals, native semantics and CDK provide behavior.

| Entry point               | Exports and options                                                                                                                                                                                  | Showcase           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `ngx-daisy/accordion`     | `DsyAccordion`: `multi`, `openAll()`, `closeAll()`; CDK coordinates child `DsyCollapse` items                                                                                                        | `/accordions`      |
| `ngx-daisy/avatar`        | `DsyAvatar`: `status` none/online/offline, `placeholder`; `DsyAvatarGroup`                                                                                                                           | `/avatars`         |
| `ngx-daisy/aura`          | `DsyAura`: `preset` gold/silver/rainbow/holo, `size`, `dual`, `glow`                                                                                                                                 | `/auras`           |
| `ngx-daisy/badge`         | `DsyBadge`: semantic `color`, `size`, `variant` solid/outline/dash/soft/ghost                                                                                                                        | `/badges`          |
| `ngx-daisy/card`          | `DsyCard`: `size`, `border` none/solid/dash, `side`, `imageFull`; `DsyCardBody`, `DsyCardTitle`, `DsyCardActions`                                                                                    | `/cards`           |
| `ngx-daisy/carousel`      | `DsyCarousel`, `DsyCarouselItem`: `activeIndex` model, `vertical`, `snap` start/center/end, `loop`, `controls`, `label`, `controlsClass`, `buttonClass`, `previousLabel`, `nextLabel`; slide `label` | `/carousels`       |
| `ngx-daisy/chat`          | `DsyChat`: `position` start/end; `DsyChatBubble`: `color`; `DsyChatHeader`, `DsyChatFooter`, `DsyChatImage`                                                                                          | `/chat`            |
| `ngx-daisy/collapse`      | `DsyCollapse`: `opened` model, `title`, `disabled`, `indicator` arrow/plus/none, `titleClass`, `contentClass`                                                                                        | `/collapses`       |
| `ngx-daisy/countdown`     | `DsyCountdown`: numeric `value` 0–999, `digits` 1/2/3                                                                                                                                                | `/countdowns`      |
| `ngx-daisy/diff`          | `DsyDiff`: `position` model 0–100, `label`, `disabled`, `stageClass`, `sliderClass`                                                                                                                  | `/diffs`           |
| `ngx-daisy/hover-3d`      | `DsyHover3d`: `disabled`; projected content retains working links/buttons                                                                                                                            | `/hover-3d`        |
| `ngx-daisy/hover-gallery` | `DsyHoverGallery`: `images` array of `DsyGalleryImage` (`src`, `alt`), `activeIndex` model, `label`                                                                                                  | `/hover-galleries` |
| `ngx-daisy/kbd`           | `DsyKbd` on native `<kbd>`: `size`                                                                                                                                                                   | `/keyboard`        |
| `ngx-daisy/list`          | `DsyList` on `<ul>`/`<ol>`, `DsyListRow` on `<li>`, `DsyListGrow`, `DsyListWrap`                                                                                                                     | `/lists`           |
| `ngx-daisy/stat`          | `DsyStats`: `orientation` horizontal/vertical; `DsyStat`, `DsyStatTitle`, `DsyStatValue`, `DsyStatDesc`, `DsyStatFigure`, `DsyStatActions`                                                           | `/stats`           |
| `ngx-daisy/status`        | `DsyStatus`: `color`, `size`; pair with visible text or an application-supplied accessible label                                                                                                     | `/statuses`        |
| `ngx-daisy/table`         | `DsyTable`, `DsyTableDataSource<T>`, `DsySort`, `DsySortHeader`, CDK table declarations                                                                                                              | `/tables`          |
| `ngx-daisy/text-rotate`   | `DsyTextRotate`: `items` (native animation supports 2–6 phrases), `duration` milliseconds, `running`, stable `label`                                                                                 | `/text-rotate`     |
| `ngx-daisy/timeline`      | `DsyTimeline` on `<ul>`/`<ol>`: `orientation`, `compact`, `snapIcon`; `DsyTimelineStart`, `DsyTimelineMiddle`, `DsyTimelineEnd`, `DsyTimelineBox`                                                    | `/timelines`       |

Sizes are `xs`, `sm`, `md` (default), `lg`, `xl`. Colors are optional: omit color for the native daisyUI base appearance, or choose `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `error`. Badge, Chat Bubble and Status no longer force neutral; set `color="neutral"` explicitly to retain that appearance. Avatar size/shape comes from projected image containers. Aura and badge variants retain complete daisyUI class names for Tailwind discovery.

## Disclosures

```ts
import { DsyAccordion } from 'ngx-daisy/accordion';
import { DsyCollapse } from 'ngx-daisy/collapse';
```

```html
<dsy-accordion>
  <dsy-collapse title="Shipping details" class="bg-base-200">
    <p>Orders ship within two business days.</p>
  </dsy-collapse>
  <dsy-collapse title="Returns" indicator="plus" class="bg-base-200">
    <p>Returns are accepted within 30 days.</p>
  </dsy-collapse>
</dsy-accordion>
```

Use `[(opened)]` for application state and `multi` for multiple expanded panels. Rich title content can use a projected element with `dsyCollapseTitle`; leave `title` empty in that case. Native heading buttons expose expanded state and reference uniquely identified regions. Closed content is hidden and inert. Closing a panel that contains focus restores focus to its heading. Disabled headings cannot be toggled by users. The disabled input does not prevent applications from changing state programmatically. The accordion uses `CdkAccordion` and `CdkAccordionItem` instead of radio-input selection tricks.

## Content composition

```html
<article dsyCard border="solid" class="bg-base-200">
  <figure><img src="/landscape.jpg" alt="Mountain trail" /></figure>
  <dsy-card-body>
    <h3 dsyCardTitle>Weekend trails</h3>
    <p>Plan a short escape.</p>
    <dsy-card-actions><button dsyButton>Explore</button></dsy-card-actions>
  </dsy-card-body>
</article>

<ul dsyList>
  <li dsyListRow>
    <span>01</span>
    <div dsyListGrow dsyListWrap>Project update</div>
    <time datetime="2026-10-20">October 20</time>
  </li>
</ul>

<ol dsyTimeline>
  <li>
    <div dsyTimelineStart>Today</div>
    <div dsyTimelineMiddle aria-hidden="true">●</div>
    <div dsyTimelineEnd dsyTimelineBox>Released</div>
  </li>
</ol>
```

Styling slots preserve native headings, lists, figures, tables and keyboard markup. Choose heading levels appropriate to the application. A status dot alone is decorative; pair it with text. Chat is a content layout, not an automatic live region. Applications decide which updates should be announced.

## Carousel and comparison

```html
<dsy-carousel label="Product views" [(activeIndex)]="selectedView">
  <section dsyCarouselItem label="Front view">...</section>
  <section dsyCarouselItem label="Back view">...</section>
</dsy-carousel>

<dsy-diff label="Reveal original photo" [(position)]="reveal">
  <img dsyDiffBefore src="/before.jpg" alt="Original photo" />
  <img dsyDiffAfter src="/after.jpg" alt="Edited photo" />
</dsy-diff>
```

Carousel supports native scroll/swipe, Previous/Next buttons, directional keys, Home/End and RTL horizontal navigation. It ignores keyboard events from nested interactive controls. Inactive slides are inert; there is no autoplay. The viewport scrolls without moving the page. Slides use their intrinsic width by default; set `slideSize="full"` for viewport-width slides and `viewportClass` for viewport gaps or sizing. Constrain the viewport height when using vertical mode.

Diff has an accessible native range control, so keyboard and touch users can compare content. Both layers are noninteractive visual content. Its divider follows the position model rather than daisyUI's browser-specific resize behavior.

Hover Gallery uses image hover zones and keyboard arrows by default. Set `controls` to show labelled selection buttons for touch or explicit navigation. Supply meaningful image alternatives. Unlike carousel, it displays an image collection rather than arbitrary projected interactive content. Hover 3D tilts content without placing hit targets over links or buttons. Reduced motion disables tilt and decorative aura animation. Countdown transitions and rotating text also respect reduced motion.

Countdown displays an application-owned value; it never starts a background timer. Own timer cleanup with Angular's destruction lifecycle. Text Rotate is decorative: supply a stable label instead of announcing each animation frame. Keep the collection between two and six phrases for daisyUI's native animation. `running=false` pauses; reduced motion shows the first phrase.

## Tables

`DsyTable` decorates a native `<table>` with `size`, `zebra`, `pinRows` and `pinCols`. Scrolling and its available height belong to an application container. It also works with `CdkTable` and custom CDK data sources. The entry point re-exports the CDK column, cell, row, header/footer and no-data declarations; no Material visual styles are included.

```ts
import { DsyTableDataSource } from 'ngx-daisy/table';

// Construct in an Angular injection context (for example a component field).
readonly source = new DsyTableDataSource([
  { name: 'Alex', tasks: 3 },
  { name: 'Taylor', tasks: 20 },
]);
readonly columns = ['name', 'tasks'];

// Signals drive client-side updates.
// source.data.set(newRows);
// source.filter.set('alex');
// source.sort.set({ active: 'tasks', direction: 'asc' });
// source.pageSize.set(10);
// source.pageIndex.set(0);
```

The showcase table contains a complete CDK column template. Add `dsySort` to the table and `dsySortHeader="name"` to each sortable `<th>`. Headers render native buttons, cycle ascending/descending/unsorted and update `aria-sort`. Bind the sort directive's `active` and `direction` models to your data source. A sortable heading should contain a label, not nested interactive controls. `disabled` on the sort group disables its buttons.

`DsyTableDataSource<T>` filters, sorts and paginates in memory without mutating the input array. Default filtering searches top-level values case-insensitively; default sorting compares numbers numerically and other values as strings. For nested data, set the `filterPredicate` and `sortingDataAccessor` signals. Read `filteredCount`, `pageCount`, `effectivePageSize`, `effectivePageIndex` and `rows`. Invalid page sizes are clamped to at least one; pages clamp to the filtered result range. Reset `pageIndex` explicitly when search criteria change if the application wants to return to the first page. Pass an `Injector` as the second constructor argument when constructing outside an injection context. Angular owns the observable lifecycle; disconnecting and reconnecting a table is supported. Use an application CDK data source for server-side queries.

## Customization and validation

All native class lists use the shared `provideDaisyUI` prefix configuration. Theme tokens and application utilities remain available. Projected slots support ordinary classes; internal collapse title/content and diff stage/slider expose explicit class inputs. Do not override hidden/inert, disabled or reduced-motion safeguards. Prefixing source-generated class names requires the application's normal Tailwind discovery/safelist setup described in [customization](daisyui-customization.md).

The CSS matrix verifies all native Data Display class families under thirteen theme/include/exclude/prefix configurations. Component tests cover expansion, focus restoration, navigation, hidden content, range state, image selection, table operations and composed prefixed styling slots. Showcase routing tests cover all 44 routes.

Official references: [daisyUI component catalog](https://daisyui.com/components/), [CDK accordion](https://material.angular.dev/cdk/accordion/overview), [CDK table](https://material.angular.dev/cdk/table/overview).
