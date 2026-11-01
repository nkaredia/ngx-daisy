# Web design and accessibility audit

**Result: the audited web showcase and supported component configurations do not currently meet WCAG 2.2 AA.** Confirmed failures include text contrast, rating target sizes, label/name mismatches and a low-contrast keyboard focus indicator. daisyUI visual parity does not establish accessibility compliance. This report records findings and remediation criteria; it does not implement component fixes or certify untested states.

Completed November 1, 2026. Source baseline: `3f73cf3`, branch `feature/web-design-a11y-audit`. Scope: `@ngx-daisy/cdk`, its shared web interaction infrastructure and the web showcase. NativeScript, iOS and Android components are excluded.

## Coverage and evidence

- **70 families:** all 68 daisyUI catalog families plus Icon and Form Field. Each route received four default-state browser scans: light/dark at 1440 × 1000 and 320 × 800 CSS pixels, **280 cases** total. See [the family matrix](coverage.md).
- Compared the catalog and class/part surfaces with installed **daisyUI 5.7.50**, its component CSS and theme definitions, and the existing [family parity inventory](../../daisyui-parity-audit.md). Reviewed the default light desktop preview for every family; contact sheets are linked below. Targeted source review covered focus, semantics, form labels, hidden content, overflow, disabled guards and motion safeguards.
- **axe-core 4.14.0:** WCAG A/AA tags through 2.2 plus best practices. Raw violations, incomplete results, selectors, HTML and contrast calculations are retained in [compressed browser evidence](evidence/browser-results.json.gz). [Summary JSON](summary.json) includes every case and passed rule IDs. Repeated nodes and the same issue at multiple widths/themes are not separate defects.
- **35 installed themes:** 665 static foreground/background token pairs calculated separately. [Token analysis](theme-token-contrast.json) is a risk inventory, not 35 rendered-theme certifications. It excludes transparency, mixed colors, images, state changes and custom themes.
- Browser scans used a local copy of the built production web showcase on port 4507. Instrumentation applied the requested `data-theme` to the showcase shell, waited for fonts/rendering and, for dark scans, one second for color transitions to settle. Nested theme scopes were preserved. This checks CSS palette rendering; it does not exercise persistence or the theme-selector workflow. Early unsettled dark results were replaced.
- No document-level horizontal overflow and no duplicate IDs were detected in the 280 default cases. This does **not** prove that nested scrolling, clipped content, text spacing or 400% zoom is compliant.

Default light preview evidence: [1](evidence/previews-1.jpg), [2](evidence/previews-2.jpg), [3](evidence/previews-3.jpg), [4](evidence/previews-4.jpg), [5](evidence/previews-5.jpg), [6](evidence/previews-6.jpg), [7](evidence/previews-7.jpg). These are component-preview crops, not full-page or every-variant screenshots. Content below the viewport can be absent from a crop.

## Confirmed accessibility findings

Priority P1 means address before an AA claim; P2 means a narrower implementation/example defect that also needs correction. Ownership distinguishes reusable library behavior, inherited daisyUI styling and showcase fixtures.

### A01 — Text contrast in semantic variants and muted content — P1

**WCAG 1.4.3 (AA). Owners: theme/component styling and showcase authors.** The browser reported contrast failures in 172 of 280 cases: 32 light cases across 16 routes and all 140 dark cases. The dark total includes shared code-viewer failures (A02); it does not mean all 70 component implementations independently fail.

Reproduce `/buttons`, light theme, and inspect the curated outline/soft variants and page introduction:

| Rendered text                          | Foreground / background |  Ratio | Required |
| -------------------------------------- | ----------------------- | -----: | -------: |
| Secondary outline button, 14px normal  | `#f43098` / white       | 3.66:1 |    4.5:1 |
| Success soft button, 14px normal       | `#00d390` / `#f1fcf6`   | 1.86:1 |    4.5:1 |
| Page description, 16px normal          | `#7e7e7f` / white       | 4.05:1 |    4.5:1 |
| Category badge text, 12px normal       | `#808082` / white       | 3.94:1 |    4.5:1 |
| Secondary soft button, dark background | `#f43098` / `#2e2732`   | 3.94:1 |    4.5:1 |

The Theme Controller example's success-colored “+18%” text is 1.78:1 on its pale surface. Other light routes with contrast flags are Alerts, Avatars, Browser Mockups, Code Mockups, Inputs, Labels, Links, Loaders, Menus, Phone Mockups, Ranges, Tabs, Theme Controllers, Validators and Window Mockups. Exact nodes and theme-specific values are in the raw evidence.

Relevant sources: [button class mapping](../../../projects/ngx-daisy/button/button.component.ts), [button page styling](../../../projects/showcase/src/app/button-demo/button-demo.scss), the installed `daisyui/components/button/object.js`, and semantic tokens in `daisyui/theme/object`. Some colors faithfully reproduce daisyUI defaults; they still need an accessible treatment. Do not silently change every upstream token or remove customization support.

**Acceptance:** audit the actual text/background pair for solid, outline, soft, ghost and link styles, including hover/focus/selected/error states and nested scopes. Normal text needs at least 4.5:1; qualifying large text needs 3:1. Disabled/decorative exceptions must be assessed individually. Provide contrast-safe theme/variant choices and use readable muted text rather than arbitrary opacity. Recheck non-text control boundaries separately under 1.4.11.

The static preset analysis found **198 of 665 potential pairs below 4.5:1**, including 39 solid semantic pairs and one body-text pair (Valentine base-content on base-300). These are hypothetical normal-text pairings, not 198 rendered failures. Large-text exceptions and actual browser gamut mapping can change applicability.

### A02 — Shared code viewer uses insufficient-contrast syntax colors — P1

**WCAG 1.4.3 (AA). Owner: showcase code viewer/build highlighter.** Every dark route has failing code tokens in its visible documentation example. For example, `#6a737d` on `#24292e` is **3.04:1**, and `#6a9955` on that background is **4.40:1**, at 13px normal text.

The [highlighter](../../../tools/showcase-builder/highlight-source.cjs) selects GitHub themes for HTML/SCSS and Light Plus/Dark Plus for TypeScript. The [viewer](../../../projects/showcase/src/app/playground/example-code.scss) supplies one shared GitHub-style editor background. Its comment and the playground README still describe One Light/One Dark Pro. Token colors and surface assumptions are inconsistent across languages; simply choosing a named light/dark theme does not guarantee AA.

**Acceptance:** align each palette with its intended background and verify every emitted token color at 4.5:1 in both schemes. Keep source text exact, safe text rendering, file tabs and per-file copy controls. Update stale palette documentation.

### A03 — Rating clear and half-star targets are too narrow — P1

**WCAG 2.5.8 (AA). Owner: Rating/daisyUI hit-area adaptation.** `/ratings` exposes an **8 × 24px** clear radio and ten **14 × 28px** half-star radios without sufficient spacing. Axe reports eleven failing targets per case, consistently at both widths and in both themes. This is not a blanket assertion that every control below 24px fails: these adjacent targets do not satisfy the spacing alternative.

[Rating template](../../../projects/ngx-daisy/rating/rating.component.html) exposes the native `rating-hidden` and half-star inputs directly; [local styling](../../../projects/ngx-daisy/rating/rating.component.scss) does not enlarge their hit areas. Installed daisyUI Rating CSS supplies the narrow visual widths.

**Acceptance:** preserve star visuals while providing at least 24 × 24px targets or compliant spacing/equivalent controls. Retest half ratings, clearing, all sizes, labels, native radio keys and touch use. Enlarging overlapping hit boxes without resolving ambiguity is insufficient.

### A04 — Read-only Rating applies an unsupported ARIA attribute to radios — P2

**WCAG 4.1.2 (A). Owner: Rating.** Five read-only heart radios on `/ratings` have `aria-readonly="true"`. The attribute is supported on the enclosing radiogroup, not on each radio. The [template](../../../projects/ngx-daisy/rating/rating.component.html) binds it in both places.

**Acceptance:** retain a valid group-level read-only state, remove unsupported per-radio ARIA, preserve the existing pointer/keyboard guards, and verify the state in a screen reader. Do not replace read-only with disabled without considering focus and discoverability.

### A05 — Textual Swap labels do not match their accessible names — P1

**WCAG 2.5.3 (A). Owners: Swap naming API and examples.** `/swaps` renders “Some” with accessible name “Select all items”, and “Updates off/on” with name “Receive updates”. The visible label is absent from the accessible name, impeding speech input.

The [Swap template](../../../projects/ngx-daisy/swap/swap.component.html) always applies the supplied label or “Toggle”, overriding names from visible projected text. [The examples](../../../projects/showcase/src/app/swap-demo/swap-demo.html) demonstrate this conflict. Icon-only swaps do not have the same visible-text requirement.

**Acceptance:** make the active visible text available in the accessible name, or use a stable visible label that is included in the supplied name. Verify off/on/mixed states and document icon-only naming separately. Preserve `aria-pressed` and inert inactive content.

### A06 — Hover Gallery numbered controls omit their visible numbers from names — P1

**WCAG 2.5.3 (A). Owner: Hover Gallery.** With optional controls enabled, three sample buttons visibly show `1`, `2`, `3`, but their generated names are “Show Alpine landscape”, etc. [The component](../../../projects/ngx-daisy/hover-gallery/hover-gallery.ts) generates both representations.

**Acceptance:** include the visible number in each name, for example “1: Show Alpine landscape”, and preserve meaningful alternative text and selected state. Test both optional controls and keyboard-only image navigation.

### A07 — Dropdown keyboard focus has only a low-contrast tint — P1

**WCAG 1.4.11 (AA). Owner: Dropdown styling.** Open `/dropdowns` with Arrow Down from “Project actions”. Focus correctly moves to “Open project”. Its only focus cue is a 10% base-content background; the outline is removed and there is no shadow. In the light theme this composites to approximately `#e8e8e8` on white: **1.23:1**.

[Dropdown SCSS](../../../projects/ngx-daisy/dropdown/dropdown.component.scss) combines hover and `:focus-visible` styling and sets `outline: none`. [Screenshot](evidence/dropdown-keyboard-focus.png). The indicator is visible in favorable conditions, but fails the 3:1 non-text contrast needed to identify the focus state. This is distinct from the stricter AAA focus-appearance criterion.

**Acceptance:** provide a contrast-safe focus outline or equivalent indicator, independent of hover, with at least 3:1 against adjacent colors. Retest inherited themes, panelClass overrides, high contrast mode and all enabled menu items.

### A08 — Showcase charts/progress apply aria-label to generic divs — P2

**WCAG 4.1.2 (A), invalid ARIA. Owner: showcase fixtures.** `/menus`, `/tabs` and `/theme-controllers` each label a generic div without a role that permits author naming. Examples include “Project completion” and “Activity increased over four weeks”. These are not defects in the Menu, Tabs or Theme Controller interaction engines.

Sources: [Menu example](../../../projects/showcase/src/app/menu-demo/example/menu-example.html), [Tabs example](../../../projects/showcase/src/app/tabs-demo/example/tabs-example.html), [Theme Controller example](../../../projects/showcase/src/app/theme-controller-demo/example/theme-controller-example.html).

**Acceptance:** use DsyProgress/native progress semantics with min/max/current values for progress; use an appropriately named image/figure and equivalent data/text for a chart. Decorative bars should be hidden from AT while their information remains available elsewhere. Remove prohibited attributes.

### A09 — Form Field default playground loses its persistent label — P2

**WCAG 3.3.2 (A). Owner: showcase fixture/default-state handling.** The required input in `/form-fields` shows only the placeholder “Workspace redesign” and a generic hint. Once text is entered there is no visible field label. Axe reports `label-title-only` as a best practice; the visible-label finding is based on source/DOM review, not reclassifying that rule as a WCAG result.

[The example](../../../projects/showcase/src/app/form-field-demo/example/form-field-example.html) uses `props().label ?? 'Project name'`, but extracted library defaults supply an empty string, so the fallback is not used. The reusable Form Field can validly rely on an application-supplied external label; this particular example supplies none.

**Acceptance:** provide a meaningful persistent example label and verify label/control association, required state and validation descriptions after edits and reset. Do not count a disappearing placeholder as the persistent instruction.

## Design and conditional implementation findings

These are actionable gaps, but are not all demonstrated WCAG failures.

| ID  | Owner / finding                                                                    | Evidence and next action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D01 | Aura example is sized against the viewport rather than its preview container.      | At 1440px, the preview is 590px wide but scrollWidth is 692px; the 548px Aura card plus stage padding pushes its right side out of the initial view. At 320px, the preview is 286px wide with scrollWidth 300px. See [contact sheet 1](evidence/previews-1.jpg), [mobile capture](evidence/auras-mobile.png), and [example SCSS](../../../projects/showcase/src/app/aura-demo/example/aura-example.scss). Use container-relative sizing and reduce nested padding; retain the Aura decoration. No page overflow does not imply no nested overflow. |
| D02 | Hero example is excessively compressed in side-properties mode.                    | The 526px hero content grid allocates only **94px** to its text column and at least 240px to art, with viewport-derived gaps/padding. It grows to 737px tall. [Example SCSS](../../../projects/showcase/src/app/hero-demo/example/hero-example.scss), [sheet 3](evidence/previews-3.jpg). Stack based on available container width, not only viewport width; verify side and bottom property layouts. This is a showcase composition issue, not proof that DsyHero changes daisyUI layout.                                                         |
| D03 | Hover Gallery has no touch navigation when optional controls are hidden.           | `controls` defaults false and `hover()` ignores touch pointers. Arrow/Home/End keys work, but touch-only users cannot select another image through the component. Add a tap/swipe or visible-control path without losing keyboard support. Physical touchscreen verification remains outstanding; source proves the absent touch handler.                                                                                                                                                                                                          |
| D04 | Calendar's explicit aria-label is superseded by its month-only aria-labelledby.    | [Template](../../../projects/ngx-daisy/calendar/calendar.component.html) always labels the grid by the month caption when no external labelledBy ID is supplied. The rendered grid is named “October 2026”, despite a configured contextual label. Preserve context plus month in naming; test multiple calendars. This is an API/naming gap, not an unnamed-grid failure.                                                                                                                                                                         |
| D05 | Diff's “noninteractive” projected layers use pointer-events only.                  | [Diff template](../../../projects/ngx-daisy/diff/diff.ts) and [SCSS](../../../projects/ngx-daisy/diff/diff.scss) do not make projected interactive descendants inert. An application-projected link could remain in keyboard order behind the clipped layer. Add a supported interaction safeguard or explicitly constrain/document content. Existing samples contain no such controls, so this is a conditional source finding, not a reproduced sample failure. Keep meaningful comparison text available to AT.                                 |
| D06 | Disabled Link leaves auxiliary activation unguarded.                               | [DsyLink](../../../projects/ngx-daisy/link/link.ts) prevents `click` but retains href and does not handle `auxclick`. Compare Button's auxiliary-click guard. Verify middle-click/context-menu behavior and define disabled-link navigation semantics. Primary disabled activation is guarded; this is not evidence that every disabled link is keyboard-activatable.                                                                                                                                                                              |
| D07 | Example control icons and palette documentation are inconsistent with conventions. | The dropdown preview renders a text ellipsis and some documentation examples use glyph markers; prefer individual Lucide icons for owned UI. Highlighter documentation disagrees with actual themes (A02). This is design/documentation consistency, not an automatic AA failure.                                                                                                                                                                                                                                                                  |

### daisyUI comparison boundaries

All 68 families remain represented; this pass found no additional missing family. Most simple families retain upstream classes and native markup: Button variants, badges, chat slots, table parts, input/select wrappers, menu structure, mockups, masks, joins and layout primitives. Existing prefix/include/exclude/custom-theme checks pass. Angular adaptations remain necessary for portals, form state, focus and date arithmetic.

The previous parity inventory records intentional adaptations: CDK overlays instead of CSS-only disclosure, Calendar's provider hooks without a third-party runtime, controlled Carousel/Diff/Gallery behavior, and page/determinate loader extensions. This audit does not replace those with CSS-only implementations. Differences that improve keyboard access should remain even when upstream examples omit them.

**Not established:** pixel-equivalent geometry for every upstream variation; every size × color × theme × state combination; motion timing parity; all responsive/RTL states; or conformance of arbitrary consumer projections and custom utilities. A full visual regression baseline needs paired native-daisyUI and ngx-daisy fixtures with identical content, viewport and theme for every documented variant. The 70 default preview captures are a review baseline, not that complete paired suite.

## Manual interaction checks and automated dispositions

| ID  | Check                                                     | Observed result / disposition                                                                                                                                                                                                                                                                               |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M01 | Carousel: Arrow Right on “Featured destinations”.         | Changes from slide 1 to 2; previous slide becomes inert and the next is exposed. Host is keyboard-focusable. Axe flags its internal scroll viewport, but the keyboard-owning host provides an equivalent path. Do not count this as a confirmed 2.1.1 failure.                                              |
| M02 | Table: Tab after playground “Show code”, then Arrow Down. | Chromium focuses the overflowing table wrapper automatically even though DOM tabIndex reads -1; Arrow Down moves its scrollTop to 40px. The axe scroll warning is not reproduced here. Explicit tabindex/name remains advisable for cross-browser reliability; Firefox/Safari are unverified.               |
| M03 | Modal: open, Shift+Tab from the first field, Tab, Escape. | Focus wraps to Create and back to the first input. Outside content is inert. Escape closes and returns focus to Create project. Nested/disableClose/long-content/mobile variants are not certified by this check.                                                                                           |
| M04 | Dropdown: Arrow Down, End, Escape.                        | Opens with focus on Open project; End skips the disabled Archive option and focuses Duplicate; Escape returns focus to the trigger. Focus styling fails A07 despite correct navigation.                                                                                                                     |
| M05 | Tabs: automatic and manual activation.                    | Arrow Right selects Activity in automatic mode and exposes its panel. In manual mode it moves focus to History while Details remains selected until Enter. Inactive panels use hidden/inert semantics.                                                                                                      |
| M06 | Calendar: Arrow Right and Page Down.                      | Focus moves October 1 → October 2, then November 2; month caption updates and each calendar has one roving date tab stop. Contextual naming still has D04.                                                                                                                                                  |
| M07 | Mobile app drawer at 320px.                               | Opens as a modal dialog, focuses its close button and makes main content inert. Selecting Ratings closes it and focuses the destination main content.                                                                                                                                                       |
| R01 | Remaining scroll warnings: Breadcrumbs and Timelines.     | Retained as review-required, not confirmed failures. Timeline contains static overflow content; verify keyboard scrolling across supported browsers. Breadcrumb links may supply a focus/scroll path. All raw targets are retained.                                                                         |
| R02 | Navbar label-in-name warning.                             | The visible word Northstar is included in “Northstar home”; the extra N is an aria-hidden decorative logo. Treat as a likely automated false positive pending speech-input testing, not a confirmed naming defect.                                                                                          |
| R03 | Missing h1, region and landmark-unique rules.             | Best-practice findings, not automatically AA failures. All pages lack an h1; desktop sidebar branding falls outside the navigation landmark; repeated example landmarks need distinguishable names where they represent distinct purposes. Improve structure without inflating the confirmed failure count. |

Axe also returned incomplete results for color contrast, label-content-name-mismatch, aria-prohibited-attr and form-field-multiple-labels. Those are **not passes**. Their exact nodes remain in the evidence and require manual disposition, particularly over gradients/images or dynamically labelled content.

## Validation and limits

The production core/web library and showcase builds pass. The showcase retains warnings for its 1.12 MB initial bundle (600 kB warning budget) and theme-builder SCSS at 7.15 kB (4 kB warning budget). The web library's **117 tests in 12 files** and showcase's **35 tests in 8 files** pass. All **14 daisyUI CSS configurations** pass, including custom themes and both prefixes. Logs: [library tests](evidence/library-tests.log), [CSS matrix](evidence/css-matrix.log), [showcase tests](evidence/showcase-tests.log), [showcase build](evidence/showcase-build.log). These validate behavior/customization foundations, not WCAG compliance. No native tests or native rendering checks were performed.

The 280 browser cases cover **idle/default rendered states**, including curated examples already visible on each page. They do not automatically open every popup, toggle every form error or inspect every source tab. Targeted interactions above are supplementary, not an exhaustive state matrix.

A formal AA claim still requires manual screen-reader testing (at least VoiceOver/Safari and NVDA/Firefox or Chrome), full keyboard paths and focus visibility/obscuration, 200% text resize, 400% zoom/reflow, text-spacing overrides, forced colors, reduced motion, RTL, touch/pointer alternatives, drag alternatives, validation/error recovery and live announcements. Also test nested overlays, disabled/read-only/required/invalid states, long/localized labels, every supported browser, and every shipped accessible theme profile. Source safeguards for reduced motion, inert panels and CDK focus are useful foundations but do not replace these tests.

See also the [criterion-by-criterion review](wcag-review.md), which explicitly marks checks not established by this audit.

## Reproducing the browser matrix

Run `yarn build` first. Supply `AXE_PATH` pointing to an unmodified axe-core 4.14.0 `axe.min.js` obtained from its official npm package, then run `node docs/audits/2026-11-01-web/audit-fixture.cjs`. The fixture serves only localhost port 4507; optional `AUDIT_ROOT` and `AUDIT_RESULTS` select the built app and result directory. It injects audit scripts into served HTML without changing authored files. Visit each route in the coverage table with `?auditTheme=light` and `?auditTheme=dark`, at the two viewport sizes, and wait for hidden `#web-audit-result` to appear. Results are written by route/theme/width. The fixture uses a one-second palette-settling delay for both schemes on future runs. It is a snapshot of audit instrumentation, not an application server or an accessibility regression test.

## Remediation order and exit criteria

1. Correct shared text/code contrast and the dropdown focus indicator; establish explicit AA-safe theme/variant profiles while keeping consumer customization.
2. Fix Rating hit areas and read-only ARIA; correct Swap/Gallery accessible names and malformed showcase chart/progress semantics; restore the Form Field example label.
3. Repair container-based Aura/Hero layouts and the Gallery touch path; resolve Calendar naming and conditional Diff/Link interaction gaps.
4. Repeat the 280-case matrix, exercise changed states and manually resolve every incomplete/remaining scroll warning. Add focused regression checks for the corrected behaviors rather than snapshotting defects as expected output.
5. Complete the assistive-technology/browser/state checks above and paired daisyUI visual fixtures before publishing an AA or complete visual-parity claim.

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — AA includes applicable A and AA criteria.
- [Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — 4.5:1 normal text, 3:1 qualifying large text and exceptions.
- [Non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — component/state visual information.
- [Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — 24px target or spacing/equivalent exceptions.
- [daisyUI component catalog](https://daisyui.com/components/) and [themes](https://daisyui.com/docs/themes/).
- [axe-core API documentation](https://www.deque.com/axe/core-documentation/api-documentation/) — automated checks support, but do not establish, conformance.
