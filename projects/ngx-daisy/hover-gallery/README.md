# @ngx-daisy/cdk/hover-gallery

Standalone Angular hover-gallery family with daisyUI styling. See the [Data Display guide](../../../docs/data-display.md) for exports, examples, behavior and customization.

## daisyUI alignment

Hovering across the image now selects the native image zones; leaving restores the first image. Up to ten images are shown. Focus the image stage and use Left/Right, Home or End for keyboard selection. Numbered controls are enabled by default, providing touch and keyboard buttons with 44px minimum targets. Set `[controls]="false"` only when the app provides an equivalent touch-accessible path. Targets wrap on narrow screens; visual enhancements are isolated in `_accessibility.scss`. `activeIndex` remains a model.
