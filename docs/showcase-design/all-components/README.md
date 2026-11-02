# Component showcase layout rollout

The Buttons page remains the design reference. The same page hierarchy now covers all 70 web component routes in the shared catalog, including the previously updated Actions category.

- A shared `DocumentationHeader` supplies the category, package entry point, page title, description and relevant daisyUI reference. Buttons retains its established authored header.
- Every page separates its interactive playground from curated UI variations. The page-scoped section index includes both destinations and retains the responsive horizontal presentation below 1200px.
- Angular usage, styling, API and accessibility sections use second-level headings; their subsections use third-level headings. Documentation code uses the shared lifted tabs, header copy buttons and visual wrapping.
- Existing examples, playground configurations, form state and component-specific interactions remain intact. No library component or native implementation changed. Theme palettes, component sizing and syntax-highlighting palettes remain unchanged.

## Validation

`yarn build` passed, followed by a final showcase build after consolidating the Actions headers. The full `yarn test` suite passed: 133 web library tests, 36 showcase tests, 94 native unit tests, four builder tests, 72 standalone documentation examples and 14 CSS configurations. Existing initial-bundle and theme-builder budget warnings remain.

Browser checks visited all 70 catalog routes at both 1440px and 375px. All 140 cases rendered exactly one page h1, an import identity and at least one playground, with valid section-index targets and no document overflow. The selected dark theme stayed unchanged across routes. See `layout-results.json` and representative Cards screenshots for the page, documentation and mobile view.

This validates the common layout rollout. It does not claim a new manual screen-reader/keyboard audit or renewed contrast certification. Existing curated variations remain page-owned; this pass does not convert every variation into an extracted inline example or rewrite their content.
