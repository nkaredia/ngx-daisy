# @ngx-daisy/cdk/diff

Standalone Angular diff family with daisyUI styling. See the [Data Display guide](../../../docs/data-display.md) for exports, examples, behavior and customization.

## daisyUI alignment

The range input now overlays the comparison stage instead of appearing beneath it. A centered handle follows the percentage divider and expands on hover, with native-size geometry. The transparent range remains keyboard accessible, labelled and disableable; its focus ring is shown on the stage. Compared layers remain noninteractive.

## Assistive technology and projected content

Both comparison layers remain in the accessibility tree, even when visually clipped. Each is a named group: `beforeLabel` defaults to `Before`, and `afterLabel` defaults to `After`; use meaningful localized labels. The native range keeps its separate `label`. Pass `aria-describedby` to associate external instructions with the range, and optionally supply a pure `valueText(position)` function for localized value descriptions; the default remains `50% before` at the midpoint.

```html
<p id="comparison-help">Use arrow keys to reveal more of the original photograph.</p>
<dsy-diff
  beforeLabel="Original photograph"
  afterLabel="Retouched photograph"
  label="Reveal original photograph"
  aria-describedby="comparison-help"
>
  <img dsyDiffBefore src="original.webp" alt="Mountain landscape before exposure correction" />
  <img dsyDiffAfter src="retouched.webp" alt="The same landscape with brighter shadow detail" />
</dsy-diff>
```

Project render-only text/images. Do not project buttons, links, form controls, contenteditable regions or positive/zero tabindex descendants: visual clipping and pointer-event suppression do not remove keyboard interaction. Put actions outside the comparison and label their relationship. The library does not silently strip arbitrary projected semantics or apply inert/aria-hidden to content that screen-reader users need. D05 is addressed through this explicit content contract; arbitrary interactive projection is unsupported, not automatically made accessible. Consumers must still verify useful alternatives, reading order and announcements with their target screen readers.
