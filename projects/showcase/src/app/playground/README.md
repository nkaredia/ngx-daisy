# Showcase playground

The internal showcase playground presents configured example components beside generated property controls. `propsPosition` is a two-way signal model accepting `side` (default) or `bottom`; the toolbar changes it without resetting values. Narrow containers stack both sections regardless of the preferred position.

```ts
export const playground: Playground = {
  components: [{ class: DsyButton /** Generate props during build */ }],
  previews: [ButtonExample],
  inlinePreviews: [
    { title: 'Colors', component: ButtonColorsExample },
    { title: 'Sizes', component: ButtonSizesExample },
  ],
};
```

Register the extracted configuration once in the showcase page's component providers:

```ts
providers: providePlayground(playground);
```

Render one instance per preview class:

```html
@for (preview of playground.previews; track preview) {
<demo-playground [component]="preview" />
}
```

Import the renderer `Playground` from `playground.component`, the registration function from `provide-playground` and the config type from `playground.types`. The renderer accepts only a preview component class, not a config object. Its internal lookup matches that class by identity against the page-scoped registered configurations. A class must have exactly one matching registration; missing or ambiguous registration produces a developer error.

Each instance renders exactly one preview and owns its values, reset behavior and `propsPosition` model. Two instances can use the same metadata without sharing mutable state. The preview class's `values` input receives that instance's complete readonly array in `config.components` order. A single compound example can therefore still consume several library component classes. Preview indices do not map to component indices.

Each values entry is keyed by TypeScript property name (`tabIndex`); controls display public aliases (`tabindex`). The button example reads the first array entry using its own input-value interface. Examples own their normal Angular bindings. `valuesChange` emits the complete array after edits or Reset. The selected preview is created by `NgComponentOutlet` and stays mounted while values and panel placement change. Reset recreates that preview so local form edits and model state return to their authored defaults alongside generated property values. Changing the preview class resets that instance's values.

## Inline previews

`inlinePreviews` is an optional array of `PlaygroundInlinePreview` descriptors, each pairing a showcase `title` with an example `component`. Render each through `InlinePreviewShell` from the playground folder:

```html
@for (preview of playground.inlinePreviews ?? []; track $index) {
<demo-inline-preview-shell [component]="preview.component" [title]="preview.title" />
}
```

The shell owns the card styling, section and accessible heading; it hosts the render-only `InlinePreview`. Keep example templates free of showcase headings, card markup and surrounding sections, and keep shell styling out of example SCSS. The example source contains only the component demonstration and any necessary local behavior.

Inline examples do not require `providePlayground`, a `values` input or extracted properties. The renderer supplies no state and creates no playground toolbar, property panel, Reset or placement controls. Examples retain their authored defaults and can still demonstrate local behavior. They are independent of the full playground's edits. Keep inline examples in a single `.ts` component file in the demo's `example` folder, with inline templates and optional inline SCSS. Full interactive examples keep their separate template/style files.

The button showcase uses a responsive compact grid for Basics, Colors, Sizes, Variants and Shapes/layouts/states. All button inline variations use static markup. `previews` continues to list full, independently controlled playgrounds.

The action-component registry maps generated metadata to select, toggle, text, number or unsupported controls. Select indices retain original literal types. Optional and nullable inputs have explicit Unset/Null actions. Reset restores recognized literal defaults; initializer expressions are never evaluated. Required inputs without a default need a selection. Unsupported types are explained rather than coerced to text.

Each referenced component has its own property group and state. Generated source class names keep group labels stable under bundling. Props are read from in-memory loader metadata; the authored `playground.ts` contains only its class references, type annotation and placeholders. Missing metadata is represented by an empty property group in contexts that do not run the loader.

Preview content is rendered within the page, not sandboxed. Preset catalogs, shareable URLs and isolated overlay/viewport previews remain future work.

Every catalog page now registers its own playground configuration and full preview examples under its demo’s `example` folder. Buttons retains its compact inline variations as well. Existing curated examples remain below each playground. Layout uses scoped SCSS and theme tokens; controls use ngx-daisy components. Showcase tests cover editing, layout placement, reset, compound component state, aliases, null/unset values and unsupported types. Builder tests cover source extraction and the metadata contract.

## Example code

The build loader resolves every full and inline preview class and captures its complete authored TypeScript file. Angular Component metadata supplies referenced `templateUrl`, `styleUrl` and `styleUrls` resources, which are captured as separate HTML/SCSS/CSS files. Inline templates/styles stay inside the TypeScript tab. No snippets, imports or selected control values are synthesized: code is displayed exactly as authored, including comments and line endings. Showcase shells are separate files and are not collected.

The loader injects optional `exampleSources` into its in-memory config copy, associating source files with preview class identity. It does not write to examples, config files or generated assets. It tracks external template/style files in the watch graph so source views refresh on edits. Missing resources and nonliteral external resource paths produce build errors. Only the component source and directly declared template/style resources are collected; transitive helper imports are not bundled into source tabs.

Full playgrounds and InlinePreviewShell use the shared ExampleCode viewer. Full playgrounds use Show code/Hide code to expand or collapse the view; inline previews always show code, ngx-daisy tabs provide keyboard file navigation, and Copy uses CDK Clipboard with success/failure feedback. Code is rendered through textContent, never HTML execution. The code area scrolls within its container on small screens. Sources are looked up through page-scoped providePlayground metadata; inline examples can still render without registration, but no code toggle appears when source metadata is absent.

Shiki tokenizes TypeScript, HTML, SCSS and CSS during build-time source extraction. The in-memory source entries include optional `tokens` (content, dual-theme color and optional font-style flags). Token offsets preserve original gaps and line endings; joining token content reproduces the exact source. The browser renders tokens using text bindings, never innerHTML, and copies the original content. No Shiki runtime or grammars ship to the browser. Syntax highlighting uses Shiki's One Light and One Dark Pro themes. Token colors use `light-dark()` and inherit the surrounding daisyUI color scheme, so the showcase theme switch updates the palette without re-tokenizing. The matching editor background and foreground can be overridden with `--example-code-background` and `--example-code-foreground`. Entries without tokens retain plain-text rendering.

Full playgrounds place Show code/Hide code in the titlebar and reveal source above the preview using DsyCollapse's button-only trigger. Titlebar layout/reset controls remain independent. Inline examples keep their HTML code visible.

Inline preview shells always display HTML source without a collapse toggle. For single-file examples, the builder extracts literal Angular `template` content as a virtual HTML entry and removes its TS embedding indentation; no file is written. External templates retain exact authored contents. Supporting TypeScript can be included through `inlinePreviews[].showTypescript` and the shell's `showTypescript` input. Button inline examples use static markup with no arrays, loops or local counter; full playground examples retain their complete source tabs.

## Catalog examples

All 70 catalog routes use the shared renderer. The property groups refer to library classes, so the build loader supplies controls from current inputs rather than handwritten control definitions. Compound examples bind groups in their configuration order (for example Accordion with Collapse, or a Table with its Row directive). Classes with no declared signal inputs show the renderer’s empty-group message; complex inputs keep realistic authored fixtures and the existing unsupported-type explanation.

Preview examples define their own input-value types and default fallbacks, and use local signal state for native editing and toggles. Dialogs and drawers have explicit open/close actions. Floating and page-positioned visuals are contained inside their samples where possible. Code tabs display the authored example files, including those bindings; they do not rewrite the source to match control edits.
