# All shipped web theme verification

Checked November 1, 2026, against source baseline `9641bc0` and installed daisyUI 5.7.50. **Web only. Code-highlighting accessibility is excluded.** No native components, toolchains or native tests were included.

All **35 presets** offered by the showcase were checked on all **70 component routes** at **1440 × 1000** and **320 × 800** CSS pixels: **4,900 rendered cases**. The actual selector inventory was also verified: 33 named options plus the light/dark switch. All 35 were selected using the real UI, then checked with an open keyboard-focused Project actions menu.

**Coverage is complete for this matrix; AA compliance is not established.** Contrast flags remain in **3,494 cases**, with at least one flagged case in every theme. These include inherited semantic/soft color combinations and showcase-owned text. Counts are raw rule findings requiring context review, not 3,494 unique component defects or a blanket rejection of every use of a preset.

## Results

- No target-size rule failures in the 4,900 static cases.
- Rating radios measured at least **24 × 24px** in every preset and viewport; larger visual sizes remain larger.
- No document-level horizontal overflow in those cases. Nested scrolling, zoom and text-spacing behavior are separate concerns.
- The keyboard-focused menu outline had at least **4.58:1** contrast against its default tinted item surface in all 35 actual theme selections (AA non-text threshold: 3:1).
- Every open menu's rendered panel background matched the selected preset's base-100 token. No stale palette was observed in the portal after theme selection.
- All 35 keyboard checks opened on Open project, skipped disabled Archive when End moved to Duplicate, and restored focus to Project actions on Escape.
- Remaining larger color changes stay [deferred](../../../web-accessibility-deferred.md); this pass does not silently recolor other presets.

## Per-theme matrix

Each row contains 140 static cases: 70 routes × two viewport sizes. Contrast/incomplete columns count cases, not unique issues. The focus column comes from the actual desktop selector/menu interaction, not only token calculations.

| Theme        | Cases | Cases with contrast flags | Incomplete cases | Rating minimum target | Menu focus contrast |
| ------------ | ----: | ------------------------: | ---------------: | --------------------- | ------------------: |
| abyss        |   140 |                        12 |              133 | 24 × 24px             |             10.15:1 |
| acid         |   140 |                        75 |              134 | 24 × 24px             |             15.83:1 |
| aqua         |   140 |                       140 |              133 | 24 × 24px             |              6.42:1 |
| autumn       |   140 |                       138 |              133 | 24 × 24px             |             13.28:1 |
| black        |   140 |                        79 |              133 | 24 × 24px             |             12.52:1 |
| bumblebee    |   140 |                        85 |              133 | 24 × 24px             |             14.73:1 |
| business     |   140 |                        85 |              133 | 24 × 24px             |              8.16:1 |
| caramellatte |   140 |                       140 |              133 | 24 × 24px             |              7.73:1 |
| cmyk         |   140 |                        83 |              133 | 24 × 24px             |             14.73:1 |
| coffee       |   140 |                       140 |              133 | 24 × 24px             |              5.67:1 |
| corporate    |   140 |                       138 |              134 | 24 × 24px             |             14.07:1 |
| cupcake      |   140 |                       138 |              134 | 24 × 24px             |             13.03:1 |
| cyberpunk    |   140 |                        75 |              133 | 24 × 24px             |             14.44:1 |
| dark         |   140 |                        62 |              134 | 24 × 24px             |             10.99:1 |
| dim          |   140 |                       140 |              133 | 24 × 24px             |              6.27:1 |
| dracula      |   140 |                         8 |              133 | 24 × 24px             |              9.87:1 |
| emerald      |   140 |                       140 |              133 | 24 × 24px             |              9.34:1 |
| fantasy      |   140 |                       140 |              133 | 24 × 24px             |             12.15:1 |
| forest       |   140 |                        22 |              134 | 24 × 24px             |              8.79:1 |
| garden       |   140 |                       138 |              134 | 24 × 24px             |             12.63:1 |
| halloween    |   140 |                        18 |              133 | 24 × 24px             |              9.03:1 |
| lemonade     |   140 |                       138 |              133 | 24 × 24px             |             14.33:1 |
| light        |   140 |                        32 |              133 | 24 × 24px             |             14.46:1 |
| lofi         |   140 |                        20 |              133 | 24 × 24px             |             16.75:1 |
| luxury       |   140 |                       140 |              133 | 24 × 24px             |              7.94:1 |
| night        |   140 |                        20 |              133 | 24 × 24px             |              8.93:1 |
| nord         |   140 |                       140 |              133 | 24 × 24px             |              9.11:1 |
| pastel       |   140 |                        85 |              134 | 24 × 24px             |             14.73:1 |
| retro        |   140 |                       140 |              133 | 24 × 24px             |              6.17:1 |
| silk         |   140 |                       140 |              133 | 24 × 24px             |              7.23:1 |
| sunset       |   140 |                       140 |              133 | 24 × 24px             |              7.04:1 |
| synthwave    |   140 |                       140 |              133 | 24 × 24px             |              8.52:1 |
| valentine    |   140 |                       140 |              135 | 24 × 24px             |              4.58:1 |
| winter       |   140 |                       140 |              134 | 24 × 24px             |              7.26:1 |
| wireframe    |   140 |                        83 |              133 | 24 × 24px             |             14.73:1 |

## Evidence and reproduction

- [Summary](summary.json)
- [All 4,900 case rows](case-matrix.csv)
- [Compressed raw browser findings](browser-results.json.gz)
- [Actual selector inventory and keyboard checks](selector-checks.json)
- [Open-menu rendering and focus measurements](focused-menus.json)

The [local audit fixture](../audit-fixture.cjs) reads the actual `showcase-themes.ts` inventory and checks it against installed daisyUI definitions. Run it from the repository root with `AXE_PATH` pointing to axe-core 4.14.0's `axe.min.js`; use `AUDIT_RESULTS` for a separate output directory. Serve the existing production web build (or run `yarn build` first if source changed).

Visit each catalog route with `?auditTheme=all` at both viewport sizes. The page cycles all 35 palettes and writes one report per route/theme/width; hidden `#web-audit-result` appears when the route is complete. This mode runs **color-contrast and target-size only**, with transitions and animations disabled to measure settled static states. It retains incomplete results and does not alter authored application files. Explicit nested theme scopes remain as authored. Normal single-theme mode retains the broader axe rule set.

For live menu checks, visit `/dropdowns?auditTheme=light&auditMenus=1`, choose each preset through the real controls, and open Project actions with Arrow Down. The fixture captures the focused menu separately. End and Escape/focus restoration were checked through keyboard actions. These interactions were tested at the desktop viewport; the mobile matrix covers default rendered route states rather than every open overlay.

The theme-builder editor and arbitrary user-created theme definitions are outside this 70-route matrix.

The archive stores all flagged nodes without the earlier 60-node truncation. `case-matrix.csv` and the coverage assertion verify every route/theme/width tuple exists exactly once. The diagnostic palette loop checks CSS rendering, not theme persistence workflows; real selector checks supplement it.

## Limits and follow-up

These checks do not certify all variants, error states, interaction states, screen-reader output, forced colors, reduced motion, zoom, RTL or arbitrary app customization. The static loop intentionally disables motion; it cannot establish motion behavior. No pixel-by-pixel visual-equivalence claim is made. Use the [WCAG ledger](../wcag-review.md) for the outstanding manual checks.

The source application was unchanged during this run. Validation for this audit tooling/report: fixture syntax check, exact inventory equality, 4,900 unique-case completeness assertions, all 35 real selection/focus assertions, preset-to-panel color matching, Prettier and local evidence-link checks. Existing web tests/build evidence is recorded in the preceding remediation reports; no native tests were run.
