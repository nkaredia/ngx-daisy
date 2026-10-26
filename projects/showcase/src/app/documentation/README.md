# Shared documentation layout

Import `DocumentationPage` into a showcase page and wrap the content in `demo-documentation-page`. Supply a readonly array of `DocumentationSection` objects (`id`, `label`). Each ID must identify an element inside the projected page content, including sections rendered by child documentation components.

```html
<demo-documentation-page [sections]="sections" navigationLabel="Card documentation sections">
  <section aria-labelledby="cards">
    <h2 id="cards">Cards</h2>
    <section id="card-usage">Usage content and examples</section>
    <section id="card-api">API reference</section>
  </section>
</demo-documentation-page>
```

The layout owns the right-hand sticky sidebar, available page width, responsive stacking and section scroll offset. It omits the sidebar when the section list is empty. `DocumentationNavigation` owns accessible native links, current-route fragments, smooth scrolling, reduced-motion handling and focus transfer. Modified clicks retain native link behavior. Targets are resolved within the supplied content root and existing tab indices are preserved.

Pages own their section metadata, content, examples and component-specific styles. Button provides the initial detailed article; every component page now uses this layout. Keep layout or navigation changes in this shared folder so new documentation pages inherit them.

## Component-specific content and API references

All 70 component routes use the shared layout. Button keeps its detailed authored article; the other 69 pages use `ComponentDocumentation`, passing their typed `ComponentDocumentationContent` and existing `Playground` configuration. `componentDocumentationSections(id)` supplies matching Overview, UI examples, Angular usage, Styling, API and Accessibility links.

Each page owns a `*-documentation.code.ts` module with its usage guidance, Angular integration notes, styling guidance, accessibility notes, event/method descriptions and standalone example. The `.code.ts` loader adds light/dark highlighting in builder memory. Keep these modules plain configuration, not Angular-decorated classes. The existing playground examples and controls remain in the projected page content.

API input tables read the extracted `PlaygroundComponent.props` metadata, including public aliases, input/model distinction, required flags, types, literal options and defaults. Runtime defaults are described without evaluating source expressions. Declarations with no inputs explain their projection-based API instead of inventing controls. Author event and method behavior in `apiNotes`.

Run `yarn test:docs` after editing snippets. It extracts all literal TypeScript documentation examples and compiles them with Angular's strict template checker against the built library. Temporary validation files stay in ignored `.angular` folders and are removed after checking. This check also runs in `yarn test`; build the library first.
