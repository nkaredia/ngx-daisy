import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'carousel',
  entryPoint: '@ngx-daisy/cdk/carousel',
  summary: 'Browse a collection of projected slides with native scrolling and explicit navigation.',
  usage: [
    'Use meaningful slide content and choose slideSize="full" for full-width views. Intrinsic slide width is the default. Give vertical carousels a constrained viewport height.',
  ],
  angular: [
    'Bind activeIndex when the application owns the current slide. There is no autoplay. The component handles native scroll/swipe and keyboard navigation without moving the page.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'viewportClass and controlsClass customize viewport layout and controls. Use slideSize="full" for equal full-width slides; intrinsic width is the default.',
  ],
  accessibility: [
    'Name the collection and its slides. Previous/Next controls and directional keys are available; inactive slides are inert, while events from nested controls are respected.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'carousel-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyCarousel, DsyCarouselItem } from \'@ngx-daisy/cdk/carousel\';\n\n@Component({\n  selector: \'app-carousel-example\',\n  imports: [DsyCarousel, DsyCarouselItem],\n  template: `\n    <dsy-carousel label="Project highlights" slideSize="full"\n      ><section dsyCarouselItem label="Planning">Planning the next release</section>\n      <section dsyCarouselItem label="Delivery">\n        Delivering the new workspace\n      </section></dsy-carousel\n    >\n  `,\n})\nexport class CarouselUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
