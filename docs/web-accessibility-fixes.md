# Web accessibility remediation progress

Follow-up to the [November 2026 audit](audits/2026-11-01-web/README.md). Native components are excluded. The original audit and evidence remain a historical baseline; this page records subsequent fixes.

## Component semantics

- A04: Rating read-only state stays on its radiogroup; unsupported per-radio attributes were removed. Pointer guards remain.
- A05: Swap's active projected text supplies its default name. Icon-only examples explicitly supply a name. Text examples no longer override their visible labels; integration guidance documents this behavior change.
- A06: numbered Hover Gallery controls include their visible number and image description in the accessible name.
- D04: Calendar names combine contextual labels with the changing month; external labelledBy references take precedence over the fallback label.
- D06 (partial): disabled Link blocks auxiliary-click navigation before application handlers, and restores it when enabled. Context-menu navigation via a retained href is still an open design question; no claim of fully inert disabled anchors is made.

Validation: production web builds passed with existing bundle/style warnings; 124 web library tests passed, including seven new regressions. Browser checks on the built Swap, Gallery, Calendar and Rating pages confirmed the naming/ARIA changes. Rating retains its eleven target-size flags because that visual/interaction change is deferred.

## Showcase fixes

- A02: the high-contrast palette change was reverted at the user’s request. Original GitHub Light/GitHub Dark (HTML/SCSS/CSS) and Light Plus/Dark Plus (TypeScript) palettes and editor backgrounds are restored. Code-highlighting accessibility is excluded from future audits; the palette contrast regression was removed. Viewer controls remain in scope.
- A01 (partial): Button page muted text and shared documentation labels/API identifiers use the readable base-content foreground. Preset-dependent semantic text and remaining example contrast findings remain open; no theme tokens or native component variants were overridden.
- A08: custom example progress bars now expose progressbar roles and values; the Theme Controller chart has image semantics and its existing description.
- A09: the Form Field preview retains a persistent Project name label when the configurable label is empty.
- D01/D02: Aura and Hero examples size against their preview containers. Hero stacks when its available container is narrow; Aura's footer wraps at mobile widths. These are app-owned composition styles, not library default changes.
- D07 (partial): Dropdown and Menu preview control icons use individual Lucide imports. Menu disclosure explicitly connects its trigger and content. Other documentation glyph examples remain for later cleanup.

Follow-up browser evidence: [109 case summary](audits/2026-11-01-web/remediation/summary.json), [raw compressed results](audits/2026-11-01-web/remediation/browser-results.json.gz), [corrected Aura preview](audits/2026-11-01-web/remediation/aura-preview.png). The run covers all 70 desktop dark pages plus 13 changed pages in desktop light and mobile light/dark. No emitted syntax-token contrast violations or document overflow were found in those cases; incomplete results are still retained as review-required. Targeted names/ARIA/labels no longer trigger their original findings. The untouched Navbar decorative-logo warning remains, with the original manual disposition.

At 1440px, Aura preview clientWidth/scrollWidth are both 590px (previous scrollWidth 692px). At 320px they are both 286px, including a footer with no overflow. Hero uses one column in side-properties mode and at mobile width, with no preview overflow.

Validation: production web build passed with existing bundle/style budget warnings; 124 library tests, 35 showcase tests, five builder tests, 72 documentation examples and all 14 CSS configurations passed. Prettier and diff whitespace checks passed. This is targeted remediation verification, not a repeated complete manual WCAG audit.

## Deferred and outstanding work

Proposals that change daisyUI defaults are parked in [web-accessibility-deferred.md](web-accessibility-deferred.md), with no runtime overrides applied. AA compliance remains blocked by those items and the outstanding manual checks in the audit ledger.

D05 (keyboard interaction inside projected Diff layers) needs a content policy that preserves comparison text for assistive technology; it remains open. Other incomplete/manual audit results remain review-required rather than assumed passes.

The 109-case evidence and five-builder-test count above describe the earlier high-contrast implementation before this requested revert. They remain historical evidence, not validation of the restored palettes.

## Small default color corrections

The user approved [bounded default foreground adjustments](subtle-contrast-adjustments.md). Selected light/dark Button text and showcase-owned primary text now use the corrected foregrounds; surfaces and original syntax palettes remain unchanged. Larger semantic/soft/tinted-background corrections remain deferred.

## Rating hit areas

A03 is implemented. Transparent native radio inputs occupy independent targets of at least 24px; decorative masks retain the native full/half-star dimensions and selected appearance. Half-star pairs join at their common boundary. Clear rating has a Lucide icon. `targetClass` and CSS hooks expose sizing/focus customization; `itemClass` now styles the decorative mask span.

Browser checks confirmed 24px minimum targets (including xs half-stars), no overlap between adjacent targets, joined visuals, native arrow-key selection, clearing and read-only guards. DOM hit testing confirms pointer access in the empty padding around the visuals. The original eleven target-size flags are absent at desktop/mobile widths in light/dark themes. No document overflow was found; larger scales can scroll inside the control. This does not certify every Rating accessibility criterion or consumer style.

Rating validation: production web builds, 127 library tests and all 14 CSS configurations passed. [Four-case Rating evidence](audits/2026-11-01-web/target-focus/rating-results.json.gz) and [keyboard-focus capture](audits/2026-11-01-web/target-focus/rating-focus.png) are retained. Reduced-motion and forced-color rules are implemented; a full assistive-technology/forced-color rendering review remains outstanding.

## Dropdown keyboard focus

A07 is implemented in a separate `_focus.scss` enhancement. Menu geometry and pointer-hover tint are unchanged; keyboard-focused items gain a 2px inset outline using base-content. Panel focus uses the same `--dsy-dropdown-focus-color` hook, with system Highlight in forced-color mode. Application utilities remain available.

[Rendered measurements](audits/2026-11-01-web/target-focus/dropdown-focus-measurements.json) show outline contrast against the tinted item surface of 14.46:1 in light mode and 10.99:1 in dark mode. [Focus capture](audits/2026-11-01-web/target-focus/dropdown-focus.png). Static calculations over all 35 preset base-content/base-100 pairs also exceed 3:1 for the default tint (lowest approximately 4.58:1); this is not browser certification of every theme or application override. Keyboard opening, End skipping the disabled item, Escape dismissal and trigger focus restoration were verified.

Final validation: production web builds, 127 library tests, 35 showcase tests, 72 documentation examples and all 14 CSS configurations passed. Existing bundle/style budget warnings remain. Code-highlighting accessibility stays excluded. Larger color corrections, Gallery touch navigation, Diff projection policy and the audit's remaining manual checks remain open.

## All out-of-box themes checked

The [35-preset web verification](audits/2026-11-01-web/all-presets/README.md) covers all 70 routes at desktop/mobile widths (4,900 cases), plus real theme selection and focused-menu checks for every preset. Rating target sizes and menu focus passed the checked conditions; contrast flags remain across all presets. Coverage does not establish AA compliance.

## Assistive-technology follow-up (colors and sizing frozen)

The user has stopped further color and sizing changes. Historical contrast/target/focus-area findings remain limitations, not an active visual-remediation plan. This increment changes no SCSS or color/size defaults and does not claim AAA conformance.

- Toast exposes per-service `accessibility()` preferences and `setAccessibility()`. Apps can offer persistent notifications and suppress/de-escalate future live announcements without removing visible messages. Existing paused/running expiry is cancelled when persistence is enabled; disabling it never restarts cancelled expiry. The showcase includes user controls and restores its original preferences when leaving the page. Scoped service providers remain independent.
- Diff exposes `beforeLabel`, `afterLabel`, `aria-describedby` and optional localized `valueText(position)`. Named groups preserve both comparison texts in the accessibility tree; the native range remains separate and keyboard-operable. Render-only projection is now an explicit documented contract. Interactive descendants remain unsupported; the library does not silently strip their semantics or hide the entire comparison from AT.
- Both showcase table scrollers are named focusable regions. The built example accepted keyboard focus and Arrow Down moved its scroll position from 0 to 40px. The original `scrollable-region-focusable` finding is absent from the targeted table run.

Validation: production core/library/showcase builds pass with existing bundle/style warnings; 133 library tests, 35 showcase tests, all 14 CSS configurations and 72 documentation examples pass. New regressions cover notification preference precedence, retained messages, cancellation of paused and future timers, Diff naming/descriptions/localized value text and retained comparison content. [Interaction evidence](audits/2026-11-01-web/assistive-support/interactions.json), [targeted browser results](audits/2026-11-01-web/assistive-support/browser-results.json.gz) and [notification controls](audits/2026-11-01-web/assistive-support/toast-preferences.png) are retained.

Browser checks use the production build at 1280px in light/dark for Toast and Diff, and light for Tables. Quiet Toast mode left the live announcer empty while retaining a dismissible notification beyond its configured five-second expiry; explicit dismissal removed it. Diff's Arrow Right changed the range and settled value text from 50 to 51 while both comparison groups remained exposed. These are DOM/accessibility-tree and keyboard checks, not listening tests with VoiceOver/NVDA/JAWS. Existing heading-one/region best-practice flags and incomplete contrast checks remain in raw evidence. No new 35-theme visual audit was required because no styling was changed. The source-highlight exclusion remains.

Remaining work: real screen-reader output and form-error/status announcements, complete keyboard/overlay traversal, reading-order/zoom/text-spacing/reduced-motion checks and app-owned contextual help/authentication/submission workflows. Other incomplete audit findings remain review-required. The historical A/AA/AAA reports are not rewritten as passes.
