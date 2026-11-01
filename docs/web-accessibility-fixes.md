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
