# Project requirements

Recovered from the complete “Plan Angular Design System” execution history and “Angular DaisyUI Design System” voice chat on October 20, 2026, and updated with the decisions in this chat.

## Purpose and scope

- Build a reusable Angular component library for any kind of app. hexaVU is the first consumer; monitoring-specific features belong in the consumer.
- Target the complete Angular Material component catalog plus additional daisyUI components. Combine overlapping components into one consistent API. Deliver this catalog in phases.
- Follow familiar Angular Material composition and behavior patterns, including form fields, input directives, dialogs, validation and Angular forms integration. Expose daisyUI semantic colors, variants and sizes naturally.
- Provide our own documentation, examples and API references. Material documentation is a familiarity reference, not a substitute.

## Styling and interaction

- Use SCSS for global and component styles, including Angular CLI generation defaults.

- Use Tailwind CSS and daisyUI for styling, with standard daisyUI appearance initially and app-controlled themes. No separate brand theme is required.
- Use Angular CDK as the foundation for overlays, focus management, keyboard navigation and accessibility as applicable.
- Keep behavior and accessibility consistent throughout the catalog.
- `DsyIcon` is a content projection wrapper only. Apps project their chosen provider's component, font markup or inline SVG into it. Apps own all icon dependencies, imports, registrations, loading and tree shaking; ngx-daisy has no default provider or provider integration layer.
- The icon wrapper supplies a CSS size input (default `1em`), an inherited color by default, semantic daisyUI colors (`primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`), and optional accessible labeling. `--dsy-icon-color` supports arbitrary CSS colors.
- Unlabeled icon wrappers are decorative. Labeled wrappers use `role="img"`; projected icon content must remain noninteractive and avoid duplicate accessible labels. Keep styling scoped to the wrapper and respect the chosen provider's markup. Document the limits of inherited styling with Shadow DOM or explicit inline sizes/colors.
- The showcase defaults to Lucide (@lucide/angular), with individual icon imports. Provider packages used by the showcase are development dependencies, not required consumer dependencies.
- `DsyLoader` supplies spinner, ring, dots, bars, ball, infinity and bar visuals with inline, section overlay and page placement. Support daisyUI semantic colors, size presets, CSS size/color overrides, speed and animation controls, an optional visible label and app-controlled active state.
- Rings and bars optionally accept a finite percentage value, clamped to 0–100. Determinate loaders use progressbar semantics and stop repeating animations; changes in value can transition. Indeterminate loaders use status semantics with accessible label text. Inactive loaders hide their content and semantics. Honor reduced motion by disabling all animation and transitions.
- Overlay and page loaders are visual loading indicators. Apps own focus, keyboard access, inert content, scroll locking, busy regions and loading start/stop. Position section overlays relative to their containing element. Demonstrate loader variants, motion controls, progress and placement in the showcase.
- Provide a composed drawer family (`DsyDrawerContainer`, `DsyDrawerContent`, `DsyDrawer`) with one directly nested drawer per container. Apps project their panel content and keep main page interaction inside the content component. Support a two-way `opened` model, `open`/`close`/`toggle` methods, CSS panel width, and logical start/end positions for RTL layouts.
- Drawer over mode is a viewport modal with backdrop/Escape dismissal, focus trapping, background inertness, scroll locking and focus restoration. Allow dismissal to be disabled while retaining explicit close controls. Side mode is persistent and nonmodal. Use daisyUI theme colors, scoped styling and reduced-motion-aware transitions. Demonstrate both modes and logical positions on `/drawers`.

## Angular conventions

- Use the latest stable Angular features, with no legacy compatibility layers or experimental APIs by default.
- Standalone components and directives; components use OnPush and ViewEncapsulation.None.
- No Zone.js dependency.
- Signal-based inputs, outputs, state, computed values, models where appropriate, signal queries and inject(). Use built-in template control flow.
- Component selectors use dsy-, native element selectors/directives use dsy, and TypeScript classes use Dsy.
- Scope any library-specific global styles carefully.
- Preserve daisyUI's CSS configuration surface: arbitrary built-in/custom/nested themes, scoped roots, include/exclude, class prefix and build logging. Support Tailwind's optional class prefix too. Apps own CSS configuration; match runtime class prefixes through the `@ngx-daisy/cdk/config` provider. Keep styles utility-overridable and inherit applicable theme tokens. Provide panel/backdrop styling hooks for the drawer. Validate native CSS configurations alongside behavior tests; see `docs/daisyui-customization.md` for the support matrix and interaction/layout boundaries.

## Workspace and packaging

- Use Yarn 4 with the node-modules linker and yarn.lock for dependency installs.

- Use an Angular CLI multi-project workspace with a library and docs/showcase application. Prefer CLI commands and generators wherever possible.
- Give every component family its own lazy-loaded showcase page. The shared showcase catalog lists all current component routes, each with a descriptive browser title. Use one shared catalog for route definitions and responsive component navigation. Keep theme selection in the shared shell so it persists while navigating. Redirect the root URL and unknown paths to `/buttons`.
- One ng-packagr library; each component family has its own secondary entry point with ng-package.json and public-api.ts. Keep components out of the root barrel and support tree shaking.
- The package name is `@ngx-daisy/cdk`; component families use secondary entry points such as `@ngx-daisy/cdk/button`. The package remains private until publishing is configured.
- Local project path: /Users/noorsil/workspace/ngx-daisy.

## Recreated starter

The workspace includes all six daisyUI Actions families: Button (including links/loading/layouts), Dropdown, FAB/Speed Dial, Modal, Swap and Theme Controller. CDK focus navigation supports menus and speed dials. Modals and drawers share focus trapping, inertness and scroll locking. Swaps support Angular forms; theme controllers retain native form semantics. See [Actions](actions.md) for API contracts and scope. Icon, loader and drawer components remain available. The daisyUI catalog is now represented; the complete documentation site remains future work.

## Data Input delivery

All 15 current daisyUI Data Input families are implemented with their own entry points and showcase routes: Calendar, Checkbox, Fieldset, File Input, Filter, Label, Radio, Range, Rating, Select, Text Input, Textarea, Toggle, Validator and OTP. A shared Form Field entry point provides labels, hints, errors, adornments and an error-state policy. Functional behavior follows Angular CDK/Material conventions; daisyUI provides appearance.

Use stable Angular 22 Signal Forms contracts for composed controls, retaining typed Reactive Forms and ngModel support through Angular's integration. Native control directives preserve built-in Angular bindings and accessors. Validation and availability belong to the form schema/validators. See [Data Inputs](data-inputs.md) for the implemented contracts, routes and explicit scope (native select, inline single-date calendar).

## Data Display implementation

All 19 families from the installed daisyUI 5.7 catalog are implemented with standalone secondary entry points and dedicated lazy showcase routes. See [Data Display](data-display.md). CDK coordinates accordions and renders data-source tables; native controls support carousel navigation, comparisons, sortable headings and galleries. Native content markup, signals, prefix/theme customization and reduced-motion behavior remain supported. The showcase now has 44 component routes.

## Remaining daisyUI families

The remaining 26 navigation, feedback, layout and mockup families are implemented. All 68 families in the installed daisyUI 5.7.50 catalog now have secondary entry points and lazy showcase pages; Icon and Form Field bring the route total to 70. See [catalog](catalog.md) and [remaining components](remaining-components.md) for the coverage audit, APIs and interaction boundaries. Existing issues will be addressed separately. The broader Angular Material catalog and full documentation website remain future scope.

## Showcase sidebar

Group navigation using daisyUI categories: Actions, Data Display, Navigation, Feedback, Data Input, Layout and Mockup. Icons live under Data Display; Form Field lives under Data Input. The sidebar header shows ngx-daisy and the library package version. The sidebar footer owns the light/dark theme control. Only the component list scrolls, preserving visible branding and theme controls on desktop and within the mobile drawer. Category and route metadata share one catalog.

On mobile, a titlebar contains an icon-only sidebar opener plus the brand/version. Hide duplicate branding inside the mobile drawer and retain its close control. Desktop keeps branding in the sidebar and has no titlebar.

## Custom showcase build pipeline

The showcase uses the private `@ngx-daisy/showcase-builder` Yarn workspace for builds and serving. Both Architect builders invoke Angular's exported experimental build APIs and install the playground extraction plugin. Installed option schemas are synchronized during dependency installation. See `tools/showcase-builder/README.md`.

Intercept imports resolving to `playground.ts`. Each exports a `playground` object with a `components` array whose entries reference component classes via `class`. Resolve each reference against authored source and inject extracted metadata at the `Generate props during build` placeholder only in the module text held in builder memory. Never persist generated metadata to authored files or temporary TS/JSON files. Support multiple referenced classes, aliases, inherited inputs/models, types, literal options, documentation and default expressions without evaluating initializers.

Use an esbuild loader with an isolated namespace for plain playground configuration modules. Keep Angular component compilation with Angular's compiler. Regenerate in-memory metadata on rebuilds and track source/type dependencies. The loader transforms runtime module contents; Angular type checking still sees authored source. The shared Playground type models generated props as optional, with discriminated action metadata and an exhaustive action-component registry. Literal unions map to select, booleans to toggle, strings to text and numbers to numeric actions; complex types are explicitly unsupported. Classify the value type, preserve null/undefined separately, and retain accepted transform types. The showcase consumes extracted metadata for playground controls and example code views.

## Playground component

The showcase playground presents a live example and generated property controls. Support a two-way `propsPosition` preference (`side` or `bottom`) with an in-component switch; stack on narrow containers. The playground config lists example component classes in `previews`. Register the config once on its showcase page with providePlayground. Each playground instance accepts only one preview class through `component`, resolves metadata internally by class identity and renders that one example. Create separate instances for multiple previews; each has independent values, Reset and position. Pass that instance’s complete values array to its preview’s `values` input. Values are grouped in component-array order and keyed by source property name while controls display public aliases. Preview indices do not map to component indices, supporting multiple examples of a component and compound examples. Demo pages no longer supply preview templates. Emit typed value changes, preserve edits across layout changes and provide Reset. Each referenced component has independent values. Use the typed action registry and ngx-daisy controls for literal selects, boolean toggles, text and number editing, with explicit unset/null actions and unsupported-type explanations. All 70 showcase pages now have ordinary full example files under their own demo/example folder, using the same renderer introduced for Buttons. Metadata stays in builder memory; generated class names provide stable property group labels. Existing examples remain below the playground. Isolated previews remain future work.

Playground configurations also support optional `inlinePreviews`, an array of title/component descriptors rendered through InlinePreviewShell in the playground folder. The shell owns the showcase title, accessible section, card border, spacing and background, and hosts a render-only InlinePreview. Keep example files limited to actual demonstration markup and behavior; no showcase headings, outer sections or shell styling belong in them. These have no property controls, toolbar, injected values or metadata registration requirement. Preserve their authored defaults and any local behavior. Buttons uses inline previews for Basics, Colors, Sizes, Variants and Shapes/layouts/states in a responsive compact grid; full previews retain their independent playgrounds.

Inline preview examples use a single component .ts file with an inline template and optional inline SCSS. This does not apply to the full interactive preview examples, which keep separate HTML/SCSS files.

Extract authored example code at build time from both previews and inlinePreviews. Capture complete component TypeScript files and directly referenced literal HTML/style resources; keep inline templates/styles in the single TypeScript tab. Preserve exact content, comments and line endings. Inject class-associated exampleSources only into the builder’s in-memory config, track external resource changes and reject missing/dynamic resources clearly. Display code in both playground and inline shells through the shared collapsible ExampleCode viewer, with keyboard-accessible file tabs, safe text rendering and exact-source copying. Code remains the authored example, independent of current control selections.

## Catalog playground delivery (October 25)

All remaining 69 component pages now register a typed playground and retain their curated examples below it. Each example binds the corresponding supported scalar inputs; compound classes use separate property groups. Form edits and local model state survive unrelated styling changes. Reset restores property defaults and recreates the preview to clear local edits. Select controls explicitly select their matching literal default, including non-first and numeric options. No generated metadata or source snapshots are persisted.

Validation: production library/showcase builds, 114 library tests, 24 showcase tests, 3 builder tests and 14 CSS configurations passed. Browser checks verified playground rendering and TS/HTML/SCSS tabs on all 70 desktop routes, plus no document overflow on all 70 routes at 375px. Targeted interaction checks covered property changes, local form state, Reset, modal and drawer dismissal. The initial bundle remains above its warning budget (about 828 kB versus 600 kB), below the 1 MB error budget.

## Native mobile foundation

Carry the ngx-daisy design system and component concepts into NativeScript Angular, rebuilding the rendering and interaction for iOS/Android. Share platform-independent Button/theme contracts through `@ngx-daisy/core`; retain web imports through re-exports. Native components live in `@ngx-daisy/native` with secondary entry points, SCSS and zoneless modern Angular APIs. The initial foundation includes theme scopes, Button and a native showcase. See [native architecture](native.md) for delivered scope, validation boundaries and follow-up families.

Native Actions expansion: all six Actions families and Icon have native entry points and showcase examples. Share native dialog lifecycle between Dropdown and Modal, portable palette contracts through core, and Tailwind/daisyUI theme tokens where compatible. Keep provider-owned icons, native accessibility, Signal Forms and explicit platform differences; see [native Actions](native-actions.md).

Native Data Input expansion: Input, Textarea and Toggle use native TextField/TextView/Switch hosts and Signal Forms contracts. Share text editing behavior, preserve native keyboard properties, keep constraints in Angular schemas, and provide dedicated themed showcase examples. See [native Data Input](native-data-inputs.md).
