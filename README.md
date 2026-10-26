# ngx-daisy

Angular CLI monorepo for a reusable Angular design system backed by daisyUI, Tailwind CSS and Angular CDK.

The recovered project decisions and full intended scope are recorded in [docs/requirements.md](docs/requirements.md). This local starter was recreated from the previous chat history on October 20, 2026.

## Development

Use Yarn 4 (pinned in package.json) with the node-modules linker. If needed, run `corepack enable` to make the pinned Yarn version available.

```sh
yarn install --immutable
yarn build
yarn test
yarn start
```

Use `yarn watch:lib` in a separate terminal while working on components. The showcase imports the built package, including its secondary entry points, so build before testing. `yarn build` builds both the library and showcase; `yarn build:showcase` builds only the showcase against the existing library build.

After `yarn start`, open a component's dedicated demo page:

| Component         | Development URL                                              |
| ----------------- | ------------------------------------------------------------ |
| Buttons           | [Buttons](http://localhost:4200/buttons)                     |
| Dropdowns         | [Dropdowns](http://localhost:4200/dropdowns)                 |
| FAB / Speed Dial  | [FAB / Speed Dial](http://localhost:4200/fabs)               |
| Modals            | [Modals](http://localhost:4200/modals)                       |
| Swaps             | [Swaps](http://localhost:4200/swaps)                         |
| Theme Controllers | [Theme Controllers](http://localhost:4200/theme-controllers) |
| Icons             | [Icons](http://localhost:4200/icons)                         |
| Loaders           | [Loaders](http://localhost:4200/loaders)                     |
| Drawers           | [Drawers](http://localhost:4200/drawers)                     |

See [Data Inputs](docs/data-inputs.md) for the 15 input routes and `/form-fields` for form composition.

The shared shell provides responsive component navigation and a theme switch that keeps its selection as you move between pages. Each page loads lazily and has its own browser title. The root URL and unknown paths redirect to Buttons.

## Agreed architecture

- Standalone components, signal APIs, OnPush, ViewEncapsulation.None, zoneless.
- Angular Material-inspired APIs; target the full Material catalog plus daisyUI extras.
- Standard daisyUI appearance with app-controlled themes; no fixed brand palette.
- Angular CDK for interaction foundations; no Angular Material dependency.
- Components use `dsy-`, native element directives/components use `dsy`, classes use `Dsy`.
- One ng-packagr library with a `ng-package.json` and `public-api.ts` in each component-family entry point.
- Prefer Angular CLI generators. Workspace component defaults enforce OnPush and no encapsulation.
- Give each component family a dedicated showcase route. Keep navigation and route definitions in the shared component catalog.

## Package

`@ngx-daisy/cdk` is the private package name. Component families are exposed through secondary entry points such as `@ngx-daisy/cdk/button`. No publishing is configured.

## Data Inputs and forms

Native field directives and composed Signal Forms controls follow Angular CDK/Material behavior patterns while using daisyUI appearance. Start at `/form-fields` for submission/validation, then use each family’s dedicated route. See [Data Inputs](docs/data-inputs.md) for the complete catalog, latest Angular forms examples and API contracts. The showcase initial warning budget is 600 kB to cover the expanded catalog’s shared native CSS; component pages remain lazy-loaded and the library uses secondary entry points.

## Icons

`DsyIcon` is a content projection wrapper for an app's chosen icon component, font markup or inline SVG. It supplies consistent size, semantic daisyUI color and accessibility:

```html
<dsy-icon size="24px" color="primary" aria-label="Home">
  <svg lucideHouse aria-hidden="true"></svg>
</dsy-icon>
```

Apps own icon package installation, imports, registration and tree shaking. The library has no default icon provider. The showcase uses Lucide (@lucide/angular) by default. See the [icon guide](projects/ngx-daisy/icon/README.md) for provider examples, styling and accessibility.

## Loaders

`DsyLoader` provides seven themed loading visuals, inline, section overlay and page placement, and optional progress values for rings and bars:

```html
<dsy-loader variant="dots" color="primary" aria-label="Loading results" />
<dsy-loader variant="ring" [value]="75" color="success" aria-label="Upload progress" />
```

Import it from `@ngx-daisy/cdk/loader`. The showcase demonstrates the variants, animation controls and placement options. See the [loader guide](projects/ngx-daisy/loader/README.md) for accessibility, progress and styling. Apps control when loaders appear and how loading affects interactions.

## Drawers

Compose `DsyDrawerContainer`, `DsyDrawerContent` and `DsyDrawer` from `@ngx-daisy/cdk/drawer` for a persistent side panel or a modal viewport drawer. The panel projects app navigation and controls, supports logical start/end positions and exposes a two-way `opened` model. Modal mode manages the backdrop, focus trap, background interaction and scroll locking. See the [drawer guide](projects/ngx-daisy/drawer/README.md) for layout, dismissal and accessible controls.

## Current scope

Implemented: all 15 daisyUI Data Input families with Signal Forms, typed Reactive Forms and ngModel support; shared form-field composition; all six daisyUI Actions families (Button, Dropdown, FAB/Speed Dial, Modal, Swap, Theme Controller), projected Icons, Loaders and Drawers. Every family has a secondary entry point and a dedicated lazy showcase page. See the [Data Input integration and API guide](docs/data-inputs.md) and [Actions guide](docs/actions.md). The broader Material/daisyUI catalog and full documentation site remain future work.

## Consumer styling

Open **Theme Builder** from the showcase sidebar to design and save custom themes, preview them across the showcase, and copy a daisyUI-compatible SCSS export. Runtime theme helpers are available from `@ngx-daisy/cdk/theme`; see the [theme guide](projects/ngx-daisy/theme/README.md).

All daisyUI CSS configuration stays in the consuming app. For custom class prefixes, add `provideDaisyUI` from `@ngx-daisy/cdk/config` with the matching daisyUI and/or Tailwind prefix. See the [configuration and customization guide](docs/daisyui-customization.md) for the option matrix, themes, scoped roots, source detection, utility overrides, component variables and drawer panel styling. `yarn test` includes the CSS compatibility matrix; run it separately with `yarn test:styles`.

Consumers compile Tailwind CSS and daisyUI. Include the library distribution in Tailwind source detection, e.g. `@source "../node_modules/@ngx-daisy/cdk";`, adjusted relative to the stylesheet. The showcase demonstrates this against `dist/ngx-daisy`. Button class names are literal so Tailwind can discover them. Apps choose daisyUI themes through `data-theme`.

## Data Display

All 19 daisyUI Data Display families are implemented with dedicated showcase pages. See [Data Display](docs/data-display.md) for imports, routes, composition and CDK behavior.

## Complete daisyUI family catalog

All 68 daisyUI 5.7.50 families now have entry points and dedicated showcase pages, plus Icon and Form Field helpers (70 routes). See the [catalog](docs/catalog.md) and [navigation, feedback, layout and mockup guide](docs/remaining-components.md). Existing issues are reserved for the follow-up refinement pass.

Component documentation is available on all 70 showcase routes, alongside the live playgrounds. Pages cover UI composition, Angular integration, styling, inputs and accessibility, with highlighted code and shared section navigation. Run `yarn test:docs` to compile the standalone documentation examples against the built library.
