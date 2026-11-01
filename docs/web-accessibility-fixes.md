# Web accessibility remediation progress

Follow-up to the [November 2026 audit](audits/2026-11-01-web/README.md). Native components are excluded. The original audit and evidence remain a historical baseline; this page records subsequent fixes.

## Component semantics

- A04: Rating read-only state stays on its radiogroup; unsupported per-radio attributes were removed. Pointer guards remain.
- A05: Swap's active projected text supplies its default name. Icon-only examples explicitly supply a name. Text examples no longer override their visible labels; integration guidance documents this behavior change.
- A06: numbered Hover Gallery controls include their visible number and image description in the accessible name.
- D04: Calendar names combine contextual labels with the changing month; external labelledBy references take precedence over the fallback label.
- D06 (partial): disabled Link blocks auxiliary-click navigation before application handlers, and restores it when enabled. Context-menu navigation via a retained href is still an open design question; no claim of fully inert disabled anchors is made.

Validation: production web builds passed with existing bundle/style warnings; 124 web library tests passed, including seven new regressions. Browser checks on the built Swap, Gallery, Calendar and Rating pages confirmed the naming/ARIA changes. Rating retains its eleven target-size flags because that visual/interaction change is deferred.

## Deferred and outstanding work

Proposals that change daisyUI defaults are parked in [web-accessibility-deferred.md](web-accessibility-deferred.md), with no runtime overrides applied. AA compliance remains blocked by those items and the outstanding manual checks in the audit ledger.

Showcase code contrast, invalid chart/progress ARIA, missing Form Field example label and Aura/Hero preview sizing are the next implementation batch. D05 (keyboard interaction inside projected Diff layers) needs a content policy that preserves comparison text for assistive technology; it remains open. Other incomplete/manual audit results remain review-required rather than assumed passes.
