# Navigation, feedback, layout and mockups

The remaining 26 daisyUI families have standalone secondary entry points and dedicated lazy showcase pages. This completes family coverage of the installed daisyUI 5.7.50 catalog. The [catalog](catalog.md) maps all 68 daisyUI families to their entry points and routes. Icon and Form Field are additional library families, making 70 showcase routes.

Import the declarations a template uses from their secondary entry point and add them to the standalone component's `imports`. Sizes are `xs`, `sm`, `md`, `lg`, `xl`. Semantic colors are `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `error`; `inherit` omits a color modifier where supported. Presentation wrappers project ordinary markup; applications own business state and navigation.

## Navigation APIs

| Entry point                  | Declarations and inputs                                                                                                                                                                                                                                  | Showcase       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `@ngx-daisy/cdk/breadcrumbs` | `DsyBreadcrumbs` (`dsy-breadcrumbs` or `nav[dsyBreadcrumbs]`), `label`; projects `<li>` elements into a native list                                                                                                                                      | `/breadcrumbs` |
| `@ngx-daisy/cdk/dock`        | `DsyDock`: `size`, `label`; `DsyDockItem` on button/a: `active`, `disabled`; `DsyDockLabel`                                                                                                                                                              | `/docks`       |
| `@ngx-daisy/cdk/link`        | `DsyLink` on `<a>`: `color`, `hover`, `active`, `disabled`                                                                                                                                                                                               | `/links`       |
| `@ngx-daisy/cdk/megamenu`    | `DsyMegamenu`: `activeIndex` model (`number` or `null`), `label`, `size`, `width` auto/wide/full, `vertical`, `panelClass`, `buttonClass`; `DsyMegamenuItem` on `<ng-template>`: label via `dsyMegamenuItem`, `disabled`                                 | `/megamenus`   |
| `@ngx-daisy/cdk/menu`        | `DsyMenu` on `<ul>`/`<ol>`: `size`, `orientation`, `paged`; `DsyMenuItem` on a/button: `active`, `disabled`, `focused`; `DsyMenuTitle`, `DsyMenuDropdown`, `DsyMenuDropdownToggle`; `DsyMenuSubmenu` on `<details>`: `opened` model                      | `/menus`       |
| `@ngx-daisy/cdk/navbar`      | `DsyNavbar`: `label`; `DsyNavbarStart`, `DsyNavbarCenter`, `DsyNavbarEnd`                                                                                                                                                                                | `/navbars`     |
| `@ngx-daisy/cdk/pagination`  | `DsyPagination`: `pageIndex` model (zero-based), `length`, `pageSize`, `disabled`, `size`, `label`, `previousLabel`, `nextLabel`, `pageLabel`; `pageChange` output                                                                                       | `/pagination`  |
| `@ngx-daisy/cdk/steps`       | `DsySteps` on ol/ul: `orientation`; `DsyStep` on li: `color`, `current`; `DsyStepIcon`                                                                                                                                                                   | `/steps`       |
| `@ngx-daisy/cdk/tabs`        | `DsyTabs`: `selectedIndex` model, `label`, `variant` default/border/box/lift, `size`, `placement` top/bottom, `orientation`, `activation` automatic/manual, `listClass`; `DsyTab` on button: `disabled`, `label`; `DsyTabPanel`: index via `dsyTabPanel` | `/tabs`        |

### Tabs

```ts
import { DsyTabs, DsyTab, DsyTabPanel } from '@ngx-daisy/cdk/tabs';
```

```html
<dsy-tabs label="Project details" [(selectedIndex)]="selected" variant="border">
  <button dsyTab>Overview</button>
  <button dsyTab>History</button>
  <section dsyTabPanel="0">Current project details.</section>
  <section dsyTabPanel="1">Previous changes.</section>
</dsy-tabs>
```

Tabs use CDK focus navigation with wrapping, Home/End, type-ahead, RTL support and disabled-item skipping. Automatic activation selects on focus; manual activation uses Enter/Space after moving focus. Each panel receives a stable ID and a label from its tab. Inactive panels are hidden and inert; projected Angular content stays instantiated. Use indexes matching the direct projected buttons. The first enabled tab is the fallback if an externally selected index is disabled or out of range. An application changing the selection while focus is inside the old panel moves focus to the new tab before hiding that panel.

Tab panels are projected after the tab list instead of relying on native daisyUI radio sibling selectors. daisyUI supplies tab appearance; Angular controls visibility and relationships. Applications can style panels with ordinary classes and inherited theme tokens.

### Menus and navigation

```html
<ul dsyMenu class="bg-base-200 rounded-box">
  <li dsyMenuTitle>Workspace</li>
  <li><a dsyMenuItem href="/overview" [active]="isOverview">Overview</a></li>
  <li>
    <details dsyMenuSubmenu [(opened)]="expanded">
      <summary>Projects</summary>
      <ul>
        <li><a dsyMenuItem href="/projects/recent">Recent projects</a></li>
      </ul>
    </details>
  </li>
</ul>
```

Menu, Dock, Navbar and Breadcrumbs preserve normal link/list/navigation semantics. They are site navigation rather than ARIA application menus. Native Tab and details/summary keyboard behavior remain available. For an action menu with roving focus and menuitem semantics, use the existing [Dropdown](actions.md) family.

Use native links, Angular RouterLink and application state as appropriate. Active navigation items expose `aria-current="page"`. Disabled link directives remove keyboard participation and intercept clicks before application handlers. Disabled button items also receive the native disabled attribute. The menu dropdown part directives supply styling only; native `<details>` is the composed disclosure API. Steps present workflow state; applications own validation and transitions between steps. Mark the current step with `current`, which emits `aria-current="step"`.

Dock is fixed to the viewport bottom by daisyUI. Applications should reserve space for it and account for their own page layout. The showcase deliberately positions the dock within its preview card.

### Megamenu

```ts
import { DsyMegamenu, DsyMegamenuItem } from '@ngx-daisy/cdk/megamenu';
```

```html
<dsy-megamenu label="Main navigation" width="wide" panelClass="app-megamenu-panel">
  <ng-template dsyMegamenuItem="Products">
    <h3>Explore products</h3>
    <a routerLink="/products">All products</a>
  </ng-template>
  <ng-template dsyMegamenuItem="Resources">
    <a routerLink="/guides">Guides</a>
  </ng-template>
</dsy-megamenu>
```

Only one panel is open at a time. CDK positions it against the trigger and viewport, copies inherited theme tokens and handles outside clicks. Opening focuses its first focusable control, or the labelled region if it has none. Escape closes and returns focus to the trigger. Moving focus outside closes without stealing focus back. Header navigation uses CDK focus management; horizontal Arrow Down also opens a panel. Disabled sections cannot open.

`width="wide"` follows the container width; `full` uses the viewport width with a margin; `auto` follows content. Use `vertical` with an application's responsive layout or CDK BreakpointObserver. The showcase demonstrates this at small widths. The Angular implementation uses connected overlays instead of daisyUI's native popover API and moving CSS anchor indicator. Native size, width and direction classes remain emitted. Panels are nonmodal, never trap focus, and retain normal link semantics. Projected actions can close the menu by setting `activeIndex` to null.

Portalled content is outside its original DOM ancestors. Theme tokens, typography and direction are copied; descendant selectors do not cross the portal. Style content through a global selector scoped to `panelClass`, or standalone utility classes.

### Pagination

`pageIndex` is zero-based; button labels are one-based. The bounded button window includes the first/last pages, current neighbors and ellipses, without creating an array proportional to the result count. Native buttons expose current-page state and disable boundary navigation. A user change emits `DsyPageEvent` with `pageIndex`, `previousPageIndex`, `pageSize` and `length`. Changing inputs clamps the effective display but does not emit a user event. Invalid sizes clamp to at least one; nonfinite sizes fall back to ten. Empty results retain one disabled page. Pagination does not fetch data; applications connect it to a CDK data source or server query.

```html
<dsy-pagination
  [length]="source.filteredCount()"
  [pageSize]="source.pageSize()"
  [pageIndex]="source.effectivePageIndex()"
  (pageIndexChange)="source.pageIndex.set($event)"
/>
```

## Feedback APIs

| Entry point                      | Declarations and inputs                                                                                                                                                                                                                                                | Showcase           |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `@ngx-daisy/cdk/alert`           | `DsyAlert`: `color` inherit/info/success/warning/error, `variant` solid/outline/dash/soft, `orientation`, `announcement` off/polite/assertive                                                                                                                          | `/alerts`          |
| `@ngx-daisy/cdk/progress`        | `DsyProgress` on native `<progress>`: `value` nullable, `max` default 100, `color`, `label`                                                                                                                                                                            | `/progress`        |
| `@ngx-daisy/cdk/radial-progress` | `DsyRadialProgress`: `value` 0–100, `color`, `size` CSS length, `thickness` CSS length, `label`; projected label or percentage fallback                                                                                                                                | `/radial-progress` |
| `@ngx-daisy/cdk/skeleton`        | `DsySkeleton`: `text`, `animate`; projected noninteractive placeholder content                                                                                                                                                                                         | `/skeletons`       |
| `@ngx-daisy/cdk/toast`           | `DsyToast`: `horizontal` start/center/end, `vertical` top/middle/bottom; `DsyToastOutlet`: placement, `toastClass`, `dismissLabel`, `dismissButtonClass`; `DsyToastService`                                                                                            | `/toasts`          |
| `@ngx-daisy/cdk/tooltip`         | `DsyTooltip`: text via `dsyTooltip`, `tooltipDisabled`, `opened` model, `position` top/bottom/left/right, `align` start/center/end, `color` inherit/primary/secondary/accent/info/success/warning/error, `tooltipClass`, `showDelay`, `hideDelay`; `show()` / `hide()` | `/tooltips`        |

The existing [Loader](../projects/ngx-daisy/loader/README.md) covers daisyUI Loading plus the library's additional page/bar/ring states. Progress wrappers are output displays, not form controls. Native progress without a value is indeterminate; finite values clamp between zero and the sanitized maximum. Radial Progress is determinate and exposes progressbar semantics. Supply meaningful labels. Skeletons are decorative (`aria-hidden`); the application owns the busy region and loading announcement. Progress, radial progress, skeleton and toast motion respect reduced-motion preferences.

Alerts announce politely by default (`role="status"`); choose assertive (`role="alert"`) only for urgent feedback or off for static content. Alert is a content wrapper. Applications can project dismiss buttons or control visibility themselves.

### Toast service

```ts
import { inject } from '@angular/core';
import { DsyToastService, DsyToastOutlet } from '@ngx-daisy/cdk/toast';

readonly toasts = inject(DsyToastService);

saveComplete() {
  this.toasts.show('Project saved', { color: 'success' });
}
```

```html
<!-- Add one outlet in the application shell, inside the intended theme scope. -->
<dsy-toast-outlet horizontal="end" vertical="bottom" />
```

`show(text, options)` returns an ID. Options are `color`, `duration` in milliseconds and `announcement` polite/assertive/off. Messages persist until dismissed by default. Positive finite durations expire automatically; timers pause for overlapping hover/focus reasons and resume with the remaining time. Use `dismiss(id)`, `clear()`, `pause(id, reason)` and `resume(id, reason)` as needed. `messages` is a read-only signal. Service destruction clears timers. New messages use CDK LiveAnnouncer; rendered alerts have their own announcements off to avoid duplicate live regions. Notifications never take focus. A single outlet should render a service queue; multiple outlets would render the same messages repeatedly.

The positioned `DsyToast` wrapper can also project arbitrary application content without the service. The outlet stays in the application DOM and theme scope instead of opening a modal overlay. Applications own page/modal stacking policy and must retain appropriate manual dismissal for important content.

### Tooltips

```html
<button
  type="button"
  dsyTooltip="Save the current project"
  position="bottom"
  color="primary"
  [tooltipDisabled]="hintsDisabled"
>
  Save
</button>
```

Tooltips use CDK connected positioning, reposition on scroll and remain inside viewport margins. CDK AriaDescriber supplies a persistent accessible description independently of the visible panel. Focus or hover opens the hint; Escape closes it. The pointer can move into the hint without immediately losing it. `tooltipDisabled` disables only the hint, preserving the native button's separate `[disabled]` binding. Use a naturally focusable trigger; the directive does not make arbitrary elements keyboard controls. Avoid essential instructions or interactive content in a tooltip. The panel displays text only and is hidden from assistive technology because its text is already supplied by the CDK description. Inherited theme values cross the portal, and `tooltipClass` styles the visible surface. `DsyTooltipPanel` is an implementation declaration exported for Angular packaging; applications should use the directive.

## Layout APIs

| Entry point                | Declarations and inputs                                                                         | Showcase      |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| `@ngx-daisy/cdk/divider`   | `DsyDivider`: semantic `color`, line `orientation`, `align` center/start/end; projected text    | `/dividers`   |
| `@ngx-daisy/cdk/footer`    | `DsyFooter` on footer/custom wrapper: `orientation`, `center`; `DsyFooterTitle`                 | `/footers`    |
| `@ngx-daisy/cdk/hero`      | `DsyHero`, `DsyHeroContent`, `DsyHeroOverlay`                                                   | `/heroes`     |
| `@ngx-daisy/cdk/indicator` | `DsyIndicator`, `DsyIndicatorItem`: `horizontal` start/center/end, `vertical` top/middle/bottom | `/indicators` |
| `@ngx-daisy/cdk/join`      | `DsyJoin`: `orientation`; `DsyJoinItem` attribute directive                                     | `/joins`      |
| `@ngx-daisy/cdk/mask`      | `DsyMask`: `shape`, `half` none/first/second                                                    | `/masks`      |
| `@ngx-daisy/cdk/stack`     | `DsyStack`: `position` top/bottom/start/end                                                     | `/stacks`     |

The existing [Drawer](../projects/ngx-daisy/drawer/README.md) supplies the remaining layout family. Divider orientation describes the line itself: horizontal maps to native `divider-vertical` (separating vertically stacked content), while vertical maps to native `divider-horizontal` (separating adjacent content). The separator's ARIA orientation follows the public API.

Mask supports squircle, heart, hexagon, hexagon-2, decagon, pentagon, diamond, square (base rectangle), circle, star, star-2, triangle, triangle-2, triangle-3 and triangle-4. Keep alternative text on images. Decorative clipping and stacks do not change the semantics of their contents. Use stacks for decorative/noninteractive layers so obscured controls do not remain keyboard targets.

Join and Indicator use attribute directives for their item slots, so they compose with native controls and other components:

```html
<dsy-join>
  <button dsyButton dsyJoinItem>Day</button>
  <button dsyButton dsyJoinItem>Week</button>
</dsy-join>

<dsy-indicator>
  <span dsyIndicatorItem horizontal="end" vertical="top" dsyBadge color="primary">8</span>
  <button dsyButton>Inbox</button>
</dsy-indicator>
```

## Mockup APIs

| Entry point                     | Declarations                                                                        | Showcase           |
| ------------------------------- | ----------------------------------------------------------------------------------- | ------------------ |
| `@ngx-daisy/cdk/mockup-browser` | `DsyMockupBrowser`, `DsyBrowserToolbar`                                             | `/browser-mockups` |
| `@ngx-daisy/cdk/mockup-code`    | `DsyMockupCode`, `DsyCodeLine` on `<pre>`: prefix via `dsyCodeLine`                 | `/code-mockups`    |
| `@ngx-daisy/cdk/mockup-phone`   | `DsyMockupPhone`: `displayClass`, `cameraClass`; generated camera and display slots | `/phone-mockups`   |
| `@ngx-daisy/cdk/mockup-window`  | `DsyMockupWindow`                                                                   | `/window-mockups`  |

Mockups decorate projected content and preserve native semantics and interactions. They are not images or iframe sandboxes. Use native pre/code for code samples; syntax highlighting belongs to the app. Use utilities for backgrounds, borders and dimensions. Browser toolbar content is projected; Phone exposes `displayClass` for its internal display surface.

## Validation and customization

Every native class goes through the shared runtime prefix renderer. Full class literals remain present for Tailwind discovery. Theme definitions, scoped roots, include/exclude, prefix configuration and logging remain application-owned. The fourteen-case CSS matrix includes the new native families, Join's utility classes and all mockup classes. Angular interaction remains available when native CSS is excluded. Styles use a nested utilities layer to preserve native appearance while allowing application utilities to override visual defaults. Hidden/inert, disabled and reduced-motion safeguards remain protected.

Build before testing because the showcase imports built secondary entry points. Behavioral tests cover tab selection/focus, RTL, pagination, disabled navigation, details state, megamenu lifecycle, tooltip descriptions and native disabled independence, toast timers and progress semantics. All 70 lazy routes are covered by showcase routing tests. Desktop/mobile browser checks validate rendered layout and representative interactions.

Official references: [daisyUI catalog](https://daisyui.com/components/), [CDK accessibility](https://material.angular.dev/cdk/a11y/overview), [CDK overlay](https://material.angular.dev/cdk/overlay/overview).
