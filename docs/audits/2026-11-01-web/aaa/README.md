# Web WCAG 2.2 AAA verification

**Verdict: full AAA support is not established, and the default web components do not satisfy AAA in all supported appearances.** Source under review: `972cb26`. This is an audit; no application styling or behavior was changed. Browser results use the production build validated in the preceding increment, not the development server.

## Completed browser results

All **4,900 expected cases** completed with no missing combinations: 70 routes × 35 presets × two viewports. Every case has at least one enhanced-contrast flag; 3,494 also have AA contrast flags. Every case retains one or more incomplete checks requiring review. Every case has at least one under-44px target candidate somewhere in the shell, playground or examples; exceptions have not been adjudicated. No document overflow was measured.

Other rule flags occur in 245 cases for keyboard-scrollable regions and 70 for the Navbar label/name case described below. These are repeated occurrences, not unique defects. The audit intentionally does not turn passes from a limited rule set into criterion-level conformance.

## Findings

1. **Enhanced text contrast (1.4.6): confirmed gap.** Both `color-contrast` and `color-contrast-enhanced` must be read together: the enhanced rule can omit pairs already reported by the AA rule. Existing subtle light/dark corrections intentionally approach 4.5:1, not 7:1. A contrast calculator and overridable theme tokens provide useful controls but do not produce verified AAA palettes or guarantee contrast on soft/hover/tinted surfaces.
2. **Enhanced targets (2.5.5): default gap.** Rating's production target measures 24 × 24px ([measurement](rating-focus.json)); Gallery controls measure 44 × 44px ([measurement](gallery-targets.json)). Compact Button and other controls also need review. The raw inventory reports every visible enabled candidate below 44px in either dimension; inline links, equivalent labels/controls, user-agent and essential-size exceptions require individual assessment. Counts are not confirmed criterion failures.
3. **Focus appearance (2.4.13): unresolved enhanced-area gap.** Rating's measured 2px inset ring on a 24px target has a rectangular area of 176px² versus a 192px² reference perimeter. Dropdown uses the same inset approach; a measured 192 × 36px menu item has a 896px² inset ring against a 912px² reference ([keyboard measurement](dropdown-keyboard.json)). These observations prevent an AAA pass; focused/unfocused pixel contrast and all additional changed pixels remain unverified. Existing AA focus contrast evidence is insufficient for AAA.
4. **Inherited A/AA findings remain.** New static checks include A/AA, not only AAA. A scrollable table example is flagged `scrollable-region-focusable`. Navbar's decorative `N`/“Northstar home” case is flagged `label-content-name-mismatch`; the accessible name includes the visible word “Northstar”, so this remains a manual false-positive candidate rather than a confirmed regression. Raw nodes preserve exact locations.
5. **Full-page/manual requirements remain unverified.** Focus visibility behind sticky content, all interaction states, browser zoom, text spacing, concurrent real-device input, screen-reader announcements, reading level, media and complete authentication/submission processes have not all been tested. No global switch can establish these properties for a consuming application.

## Coverage and limits

The batch checks the shared 70-route catalog in every one of the 35 actual shipped presets, at 1440 × 1000 and 320 × 800. Inspect [summary.json](summary.json) for completeness and missing cases, [per-theme results](theme-results.md), [case matrix](case-matrix.csv) and [raw results](browser-results.json.gz). [Grouped findings](findings.json.gz) consolidate the same rule/target by route while retaining themes and widths; they are review groups, not adjudicated unique defects. Per-theme numbers count route/viewport cases with flags, not unique defects. Incomplete checks remain unresolved. The target inventory is a geometry review aid, separate from axe's AA target-size rule.

The [criterion ledger](criteria.md) covers all 31 AAA criteria and links the historical 55-criterion A/AA review with remediation context. It separates library hooks, consumer responsibilities and verification gaps. It is not an accessibility conformance report declaring passes.

Static measurement disables animations/transitions to stabilize layouts. That does **not** verify reduced motion or motion/flash criteria. Only mounted default examples are included: unopened dialogs/menus, all property combinations, all hover/pressed states, Theme Builder, custom themes and production consumer workflows remain outside this batch. Supplemental Rating/Gallery checks use a 1280px viewport and are retained separately, not counted in the matrix. Targeted Rating keys confirmed selection advances. A light-theme Dropdown check confirmed Arrow Down opening/focus, End skipping the disabled item and Escape returning to the named trigger. These are limited interaction checks, not complete keyboard support.

Syntax-highlighted source text remains excluded at the user's request. Code-viewer controls remain included. Consequently this audit cannot establish complete showcase-page conformance even if all measured rules passed. Native components were excluded.

## Reproduce

Use the production build and axe-core 4.14.0, installed separately for audit tooling:

```sh
AUDIT_AAA=1 AXE_PATH=/absolute/path/to/axe-core/axe.min.js AUDIT_RESULTS=/private/tmp/ngx-daisy-aaa-results node docs/audits/2026-11-01-web/audit-fixture.cjs
```

Open `/buttons?auditTheme=all&auditBatch=1` at the fixture's localhost URL in a real browser. Each route submits results and navigates to the next catalog route. Run once at each documented viewport. Keep viewport dimensions fixed until the batch completes. Then:

```sh
AUDIT_RESULTS=/private/tmp/ngx-daisy-aaa-results node docs/audits/2026-11-01-web/aaa/summarize.cjs
```

The summarizer checks all expected route/theme/width combinations and exits nonzero on missing or duplicate cases. Preserve raw incomplete checks rather than replacing them with passes. No build/test suite was rerun for this audit-only change: the preceding production build and test evidence is documented in the [capability guide](../../../web-accessibility.md).

## Remediation order

- Provide verified enhanced color combinations for every semantic variant/state/background, preserving original presets and separating deliberate overrides.
- Supply enhanced target and focus styling with explicit utility-overridable hooks, then measure target geometry, focus area and focused/unfocused contrast.
- Resolve the scrollable table finding and triage incomplete checks and the Navbar naming flag.
- Complete manual keyboard/AT/zoom/motion and page-process checks before assigning criterion-level conformance results.

Sources: [WCAG 2.2 conformance](https://www.w3.org/TR/WCAG22/#conformance), [Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html), [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html), [Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html).
