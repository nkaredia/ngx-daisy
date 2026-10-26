import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'hover-gallery',
  entryPoint: '@ngx-daisy/cdk/hover-gallery',
  summary: 'Preview a collection of images through hover zones or explicit selection controls.',
  usage: [
    'Use for alternate product views rather than arbitrary interactive slide content. Enable controls for clear touch navigation and supply useful image alternatives.',
  ],
  angular: [
    'Pass an images array of src/alt objects and bind activeIndex if selection belongs to application state. Pointer leave restores the first image.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'The stage supports keyboard arrows. Give the collection a label, include meaningful alt text and show controls when hover alone would obscure discoverability.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'hover-gallery-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyHoverGallery } from '@ngx-daisy/cdk/hover-gallery';\n\n@Component({\n  selector: 'app-hover-gallery-example',\n  imports: [DsyHoverGallery],\n  template: `\n    <dsy-hover-gallery\n      label=\"Product views\"\n      controls\n      [images]=\"[\n        { src: '/assets/front.jpg', alt: 'Front view' },\n        { src: '/assets/back.jpg', alt: 'Back view' },\n      ]\"\n    />\n  `,\n})\nexport class HoverGalleryUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
