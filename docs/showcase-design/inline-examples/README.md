# Richer inline example presentation

Buttons is the first consumer of optional example framing. The shared inline shell now supports:

- `presentation="plain"` (default): retain the existing presentation on other pages.
- `presentation="framed"`: separate the title/description, centered preview surface and always-visible source.
- `presentation="split"`: use a preview/source composition side by side once the shell's own container reaches 40rem; stack below that width. The breakpoint follows available content width, not the entire browser window.

The source viewer has independent `copyPlacement="header"` and `wrap` options. Framed shells enable these so the copy control has its own language header and long lines wrap visually. Both retain the exact extracted text and per-tab copying. Existing viewer defaults, highlighting palettes and editor backgrounds remain unchanged elsewhere. Source rendering still uses textContent, never innerHTML.

Buttons uses split framing for the starter and a new workspace-sharing example that pairs a primary save action with a quieter Cancel action. Its five original variation sets use stacked framing. The full playground remains independent and unchanged. The contextual example is a static composition, not a persistence workflow; consuming apps own action handlers. Both added examples remain single-file components with no documentation shell inside their source.

No library component colors, sizes, behavior, theme definitions or icon providers were changed. Preview surfaces use the existing inherited base theme tokens. No new motion was added. Screen-reader and keyboard verification remain parked; ordinary source-viewer regression tests are retained.

## Validation

Production library and showcase builds pass with the existing bundle/style warnings. Regression checks cover keeping local example state when switching presentation, retained exact source text when wrapping, per-file copy placement and HTML-first source ordering. The visual review specifically caught and corrected the copy icon overlapping a long code line in a narrow source pane.

Final checks: 36 showcase tests, four builder tests and 72 documentation examples pass. [Preset results](validation.json) cover all 35 shipped themes at 1440px and 320px (70 cases) with no document overflow. [Raw results](preset-results.json.gz) retain existing color flags and incomplete checks; these are frozen limitations, not newly certified passes. [Preview containment](preview-containment.json) checks all seven frames at both widths and found no buttons or links clipped beyond their preview surfaces.

Review images: [desktop](desktop.jpg), [mobile stacking](mobile.jpg), [contextual action hierarchy](action-hierarchy.jpg). The five original variation sets and one full interactive playground remain alongside the starter and new contextual example.

Example code now uses native lifted tabs (`variant="lift"`), as requested. Round toolbar buttons and highlighting palettes remain unchanged. Production builds and all 36 showcase tests pass; the [70-case layout check](lifted-tabs-validation.json) found no document overflow across all 35 presets at desktop/mobile widths. [Lifted-tab preview](lifted-tabs.jpg).

The nested-border follow-up removes the code header/source block outer frames: the native lifted panel alone owns the outer border and corner geometry. The language header retains one bottom divider. [Computed first/second-tab borders](lifted-border-measurements.json) confirm zero source borders and only the header divider inside the native panel. Showcase build and 36 tests pass; [all-preset layout checks](lifted-border-validation.json) have no document overflow. [Corrected preview](lifted-border-fixed.jpg).
