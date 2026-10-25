# ngx-daisy library

Reusable Angular components built on daisyUI and Tailwind, with Angular CDK for interaction foundations.

From the repository root, run `yarn build` before `yarn test`; the showcase tests import the built library. Use `yarn build:lib` to build only the library.

Run `yarn start` for the showcase, with dedicated demo pages at `/buttons`, `/icons`, `/loaders` and `/drawers`. Its shared shell provides component navigation and retains the selected theme across routes. Demo pages load lazily, and a shared catalog defines both navigation and routes. Add a dedicated route and catalog entry when introducing a component family.

Import the button through `ngx-daisy/button`, the icon wrapper through `ngx-daisy/icon`, the loader through `ngx-daisy/loader` and drawer components through `ngx-daisy/drawer`. Every component family has a secondary entry point containing its own `ng-package.json` and `public-api.ts`.

`DsyIcon` wraps projected content from the app's chosen icon provider or inline SVG. Apps install their own icon packages and manage imports, registration and tree shaking. The wrapper supplies size, semantic daisyUI color and accessible labeling. See [the icon guide](icon/README.md) for examples.

`DsyLoader` supplies seven loading visuals, semantic daisyUI colors, animation controls and inline, overlay or page placement. Rings and bars also support percentage progress. Apps manage loading state and interaction behavior. See [the loader guide](loader/README.md) for usage and accessibility.

`DsyDrawerContainer`, `DsyDrawerContent` and `DsyDrawer` compose a persistent side panel or a modal viewport drawer with focus and background interaction management. Apps project navigation and close controls. See [the drawer guide](drawer/README.md) for usage and accessibility.

The package name is provisional and private. Publishing is not configured. See the root README and `docs/requirements.md` for development guidance and the full intended scope.

Configure daisyUI's themes, root, include/exclude and logging in the consuming stylesheet. Match nondefault class prefixes with `provideDaisyUI` from `ngx-daisy/config`. See [configuration and customization](../../docs/daisyui-customization.md) for prefix safelists, theme tokens, utility overrides and the compatibility test matrix.
