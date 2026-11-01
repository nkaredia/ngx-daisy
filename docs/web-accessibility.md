# Web accessibility: AA baseline and AAA capability

The goal is to let consuming applications meet every applicable WCAG 2.2 requirement, including AAA where practical. There is no library-wide conformance claim: WCAG conformance covers complete pages and complete processes, including app content, custom themes, utilities and third-party integrations. A component must not prevent the app from meeting a criterion.

Authoritative reference: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). The existing [web audit](audits/2026-11-01-web/README.md) and [all-preset results](audits/2026-11-01-web/all-presets/README.md) remain evidence of the tested scope, not certification. Native components are outside this work.

## Consumer controls and responsibilities

| Concern                                        | Library support / consumer action                                                                                                                                                           | Verification still required                                                                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text contrast (1.4.3 AA, 1.4.6 AAA)            | Theme tokens, content-color pairs, foreground hooks and app utilities. Use 7:1 for normal text and 4.5:1 for qualifying large text when targeting AAA.                                      | Every rendered foreground/background pair, including soft/tinted, hover, active, selected and validation states across all shipped themes.                                                      |
| Non-text contrast (1.4.11 AA)                  | Override borders, icons, selected indicators and focus hooks independently. Do not rely on color alone.                                                                                     | Necessary indicators against actual adjacent surfaces: 3:1, subject to criterion exceptions.                                                                                                    |
| Target size (2.5.8 AA, 2.5.5 AAA)              | Gallery controls default to 44px targets. Rating exposes `--dsy-rating-target-size`: set it to `44px` on the component for enhanced targets. Other controls accept size/class/slot styling. | All actionable targets; do not assume the visual size preset or spacing alone satisfies AAA's 44 × 44px requirement. Test compact layouts and overlaps.                                         |
| Focus (2.4.7 AA, 2.4.11 AA, 2.4.12/2.4.13 AAA) | CDK focus handling, component focus styling and override hooks. Apps must preserve visible focus and account for sticky headers/footers and clipping.                                       | Full visibility at AAA; qualifying indicator area at least a 2px perimeter and 3:1 focused/unfocused pixel contrast. Existing inset outlines are not automatically evidence of sufficient area. |
| Keyboard and modality                          | Native controls or CDK foundations, explicit dismissal, disabled/inert states. Gallery now has default touch buttons as well as arrow keys.                                                 | Keyboard-only, touch, pointer, screen reader and mixed-input journeys, including nested overlays and focus restoration.                                                                         |
| Motion and timing (including 2.3.3 AAA)        | Reduced-motion safeguards; app-owned timers/autoplay unless explicitly documented otherwise.                                                                                                | All motion pathways and animations caused by interaction. Respect reduced motion; expose pause/stop/disable for app-owned behavior as applicable.                                               |
| Zoom, spacing and reflow                       | Utility-overridable dimensions and responsive examples.                                                                                                                                     | 200% text resize, 400% zoom/reflow, text-spacing overrides, long labels, translations and RTL. Avoid fixed heights that clip user text.                                                         |
| Names, instructions, errors                    | Projected semantic markup, label/description/error hooks, Angular validation and form-field composition.                                                                                    | App labels, useful error suggestions, error prevention, help and confirmation for consequential actions. Placeholder text is not a persistent label.                                            |
| Content and complete processes                 | Apps own headings, meaningful alternatives, language, reading level, consistent help, authentication, media alternatives and application workflows.                                         | Applicable A/AA/AAA content and process criteria. No CSS profile or library switch can guarantee these.                                                                                         |

## Checking custom color pairs

`@ngx-daisy/cdk/theme` exports a browser-independent assessment helper:

```ts
import { evaluateDaisyContrast } from '@ngx-daisy/cdk/theme';

const result = evaluateDaisyContrast([118, 118, 118], [255, 255, 255]);
// result.ratio is unrounded; result.aa / result.aaa expose normalText and largeText.
// result.nonText checks the 3:1 ratio only, not all requirements of 1.4.11.
```

Inputs are resolved, opaque sRGB channels (0–255). Resolve theme variables, convert other color spaces and composite transparency against the actual backdrop before calling. This helper does not parse CSS, inspect the DOM, choose a theme, modify colors or classify text size. Large text generally means at least 24 CSS px, or roughly 18.67 CSS px when bold; verify the actual delivered typography. Gradients/images require checking the least favorable area behind the text. Passing one pair does not establish component or page compliance.

## Remaining work, in priority order

1. Turn the existing 35-theme contrast findings into unique component/state/background cases, with both AA and AAA thresholds. Preserve the accepted subtle defaults. Keep stronger daisyUI deviations in separate files for review; do not silently recolor every preset.
2. Provide verified enhanced foreground/surface combinations for variants that cannot reach 7:1 with a foreground change alone. Preserve original presets and app overrides; document combinations that need a surface change.
3. Audit every action target and focus indicator for the enhanced criteria, then supply missing slot hooks or isolated enhancements. Rating supports 44px targets but is not asserted AAA in every layout.
4. Run manual screen-reader, keyboard, zoom, forced-colors and reduced-motion checks. Automated contrast/target checks cannot replace these.
5. Publish criterion-by-criterion support and consumer responsibilities with evidence and unresolved gaps for each component family.

Syntax-highlighting text remains excluded from our audits at the user's request. Its existing palettes remain unchanged. Code-viewer tabs, copy buttons, focus and keyboard behavior remain in scope. A full consuming-page conformance evaluation must still address all applicable content, including code samples.

## Validation of this increment

Production core/library and showcase builds pass. The showcase retains its existing initial-bundle and theme-builder style warnings; skill folders are excluded from Tailwind source scanning. Checks pass: 130 web library tests, 35 showcase tests, 14 CSS configurations, four builder tests and 72 documentation examples. Gallery tests cover default controls, selection and explicit opt-out keyboard behavior. Contrast tests cover black/white, symmetry, near-threshold AA/AAA distinctions and invalid inputs. No new all-theme browser or assistive-technology run was performed for this increment; the prior matrix is historical evidence and does not verify these changes. Palette correction work remains open.
