import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'hero',
  entryPoint: '@ngx-daisy/cdk/hero',
  summary: 'Compose a prominent page introduction with content and optional visual overlay.',
  usage: [
    'Use a concise heading and a clear primary destination. Keep copy readable against media and avoid making the hero dominate small screens.',
  ],
  angular: [
    'Project content through DsyHeroContent and an optional DsyHeroOverlay. Ordinary links, buttons and Angular bindings remain application-owned.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Use a heading level appropriate to the page. Describe meaningful images and ensure text remains readable over any background treatment.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'hero-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyHero, DsyHeroContent } from \'@ngx-daisy/cdk/hero\';\n\n@Component({\n  selector: \'app-hero-example\',\n  imports: [DsyHero, DsyHeroContent],\n  template: `\n    <section dsyHero class="bg-base-200 rounded-box">\n      <div dsyHeroContent class="p-8">\n        <div>\n          <h3>Build your next workspace</h3>\n          <p>Bring your team and projects together.</p>\n          <a href="/projects">Explore projects</a>\n        </div>\n      </div>\n    </section>\n  `,\n})\nexport class HeroUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
