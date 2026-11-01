# Swap

See the [Actions integration and API guide](../../../docs/actions.md#swap) for composition, inputs, accessibility and customization.

## daisyUI alignment

The default variant is now plain, matching native swap without an added button surface. Set variant="ghost" to retain the previous DsyButton appearance. Explicit button variants, colors, sizes, checked/indeterminate state and Forms integration remain supported.

## Accessible names

Text swaps use their active projected text as the accessible name by default. Inactive text remains hidden from assistive technology. For icon-only swaps, supply a meaningful `aria-label`. If you explicitly label a text swap, that name must contain its visible label in every state; alternatively put a stable visible label next to an icon-only swap. The previous automatic “Toggle” name is no longer applied.
