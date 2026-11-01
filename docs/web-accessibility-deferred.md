# Deferred daisyUI accessibility overrides

Current decision: colors and sizing are frozen at the user’s request. The proposals below are historical limitations, not authorized follow-up work. Focus subsequent remediation on semantics, keyboard operation and assistive-technology support.

These remaining audit fixes are deferred. The user subsequently approved subtle default text-color corrections; [the implemented subset](subtle-contrast-adjustments.md) is no longer deferred. Larger deviations still require separate review. This file contains proposals only, not loaded CSS. Reference: [November 2026 web audit](audits/2026-11-01-web/README.md).

| Audit finding               | Default that would change                                                                                                                                                        | Proposed follow-up                                                                                                                                                                                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01: semantic text contrast | Small light/dark Button text corrections are implemented. Soft colors, other component variants, stronger tinted surfaces and remaining preset palettes can still fall below AA. | Decide on opt-in accessible theme profiles or a separate variant-styling layer. Keep original presets available. Validate normal text at 4.5:1 and qualifying large text at 3:1 in all states. Showcase-owned opacity/text choices can be corrected separately without changing library defaults. |

These deferrals mean WCAG AA cannot yet be claimed. Consumer custom themes and utilities still require their own verification. No native mobile changes are included.

## Completed follow-ups

- **A03 — Rating targets:** native radios now have separate non-overlapping targets of at least 24px, with unchanged star visual sizes and a visible clear icon. See [Rating customization and migration](../projects/ngx-daisy/rating/README.md#accessible-target-areas).

- **A07 — Dropdown focus:** keyboard-focused items now retain the native tint with a 2px inset base-content outline. Panel focus uses the same color hook. See [Dropdown customization](../projects/ngx-daisy/dropdown/README.md#keyboard-focus).

- **D03 — Hover Gallery touch path:** numbered controls now default on, with wrapping 44px minimum targets. Apps opting out must provide an equivalent touch-accessible path. Enhancements are isolated in `hover-gallery/_accessibility.scss`.

The [AA/AAA capability guide](web-accessibility.md) records enhanced targets, consumer controls and remaining verification.
