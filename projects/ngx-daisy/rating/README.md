# Ratings

See the [Data Input integration and API guide](../../../docs/data-inputs.md) for Angular forms, composition, accessibility and customization.

## daisyUI alignment

Omitting color now uses daisyUI base-content rather than warning. Set color="warning" to retain the previous appearance. Semantic names and arbitrary CSS colors remain supported.

## Accessible target areas

Each native radio occupies a separate target of at least 24 × 24 CSS pixels. Whole stars keep their native visual size; half-star pairs remain joined visually, with extra space between stars to give each half its own non-overlapping target. `allowClear` shows a Lucide clear icon rather than an invisible narrow radio. Native radio keys, forms, read-only guards and disabled states are retained.

`itemClass` styles the decorative mask span, not the transparent native radio. Use `targetClass` for the target container, `--dsy-rating-target-size` to increase target dimensions and `--dsy-rating-focus-color` for its focus outline. Preserve the minimum hit area and visible keyboard focus when customizing. Long scales scroll within the component rather than widening the page. Focus/motion safeguards and system-color fallbacks are retained.
