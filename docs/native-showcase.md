# Native showcase shell

The native showcase follows the web showcase's shell: grouped navigation, ngx-daisy/version branding, a mobile navigation opener, persistent wide-screen sidebar, and a fixed footer containing light/dark, preset selection and Theme Builder controls. It uses NativeScript views, the shared design tokens and Tailwind utilities rather than embedding the browser site.

## Navigation and layout

`projects/native-showcase/src/app/shell/catalog.ts` drives labels, categories and page selection. The implemented native catalog has 22 pages: the six Actions families, Icon, Card, Badge, Alert, Progress, Skeleton, Input, Textarea, Checkbox, Radio, Range, Select, Form Field, Fieldset, Toggle and Divider. Categories follow the web order: Actions, Data Display, Feedback, Data Input and Layout. Unimplemented native families do not have dead navigation entries.

Below 1024 DIP, a titlebar shows the navigation button and brand/version. The drawer shows Components and a close button, avoiding duplicate branding. The drawer overlays its backdrop, disables and hides the underlying page from accessibility, and closes when selecting a page or tapping the backdrop/close control. On Android, Back closes the drawer first and returns other component pages to Buttons before the normal root behavior.

At 1024 DIP and above, the sidebar occupies its own 288-DIP column and the titlebar is omitted. The Theme Builder hides permanent navigation and the titlebar at every width, providing a floating navigation trigger instead. Layout changes recalculate the mode. Only the category list scrolls inside the sidebar; its header and theme footer remain visible. Component page content scrolls independently and resets to the top after navigation.

Button examples now live in their own component. Each Actions family can be selected independently through the catalog, while shared example rendering stays outside the shell. The shell's reusable icon-button component keeps a real native Button for activation/accessibility and projects noninteractive artwork above it. The library's Icon remains provider-independent.

## Themes

The preset catalog imports daisyUI's public `theme/object` and `functions/themeOrder` data. All 35 built-in definitions pass through the shared theme contract and native color/length converter. Browser CSS is not imported. Light/dark remain a separate switch; other presets appear in a native picker with each theme's four-color swatch. The selection persists across page navigation and app restarts. Native checked-property echoes do not override a selected preset.

The native Theme Builder edits all 28 portable daisyUI tokens, theme name, color scheme and default/dark preference flags. It previews valid drafts locally, validates native colors and lengths before applying, saves one named custom theme, and supports JSON import plus exact JSON and daisyUI plugin CSS copying. Invalid drafts leave the preview on the current applied theme and show validation on apply/export. Built-in preset names are reserved when saving. Browser compressed share links and browser color picker widgets are not used in native; exported JSON is portable across the apps.

The picker uses the anchored native Dropdown. Sidebar navigation is app-owned native layout, with shared motion preferences and an iOS snapshot transition that preserves live layout; see the rendering correction below.

## Verification

`yarn check:native` builds the packages, checks strict templates, creates iOS/Android JavaScript bundles, checks Tailwind output and selected icon modules, and runs artwork/preset/catalog checks. `yarn test:native` covers native component state and renderer contracts. The shell checks ensure every built-in preset converts to native tokens and every supported component has exactly one category entry.

Screen-reader interaction, Android native rendering/back behavior, tablet layout and larger font scales require device verification; compilation and unit tests do not establish those results.

### iPhone verification

Verified on iPhone 17 / iOS 26.5: mobile branding/version; Lucide menu, close, category and footer icons; dimmed backdrop dismissal; background removal from the accessibility tree while navigation is open; component selection closing the drawer; preset swatches and Synthwave selection; independent light/dark switching; native custom color editing; custom theme persistence after restart; and the builder's floating navigation trigger. These are simulator interactions and accessibility-tree inspection, not a screen-reader audit.

Strict templates, both platform bundles, selected-icon checks, all 35 preset conversions, the catalog checks, three artwork tests and 23 native unit tests passed. Tablet rendering and Android device behavior remain unverified.

The Data Input expansion adds account details with validation, a live bio editor and notification preferences. See [native Data Input](native-data-inputs.md) for APIs and verification.

Select, Form Field and Fieldset add custom anchored selection popovers and schema-driven presentation. See [native form composition](native-form-composition.md) for usage and verification.

Dropdown and Select use the shared custom [native popover](native-popover.md), with app-authored rich item/option templates. The showcase RootLayout surrounds its Frame, and its Android Back handler dismisses popovers before changing pages.

### Initial Android device verification (October 28)

Installed and launched a debug build on a Samsung SM-F766W running Android 17, using NativeScript Android 9.1.1 and SDK target 36. Checked checkout activation/completion, temporary drawer rendering and page navigation, anchored rich dropdown rows/icons/shadows, and Android Back dismissing the popover.

The device pass exposed native Button backdrop elevation intercepting panel taps. Drawer and popover backdrop buttons now set both Android elevation and dynamic elevation offset to zero. Workspace setup also records the Android runtime, discovers the standard local SDK, supplies an app-local core-package link for native plugin AAR resolution, and checks Android's ESM bundle output.

The Android button-icon renderer now uses a centered foreground drawable instead of native text spans; regression tests cover density, clearing and native text independence. Final visual confirmation of this update and the remaining control/modal interactions is pending direct phone checks. TalkBack, font scaling, fold/rotation behavior and a complete Android visual audit remain separate follow-up verification.

A subsequent direct phone check confirmed that the modal opens, and the device screenshot showed the close icon rendering correctly. It also exposed Android's opaque native dialog background behind the rounded panel. The modal presenter now clears that window background; the updated package is deployed, with final visual confirmation awaiting the direct phone check.

## Web-aligned shell

The native shell mirrors the web sidebar's base-100 surface, category headings, compact
navigation links and primary-tinted current page. Brand and version sit together in the
mobile titlebar; the version uses the same compact token-based badge on desktop. Only
category navigation scrolls, leaving the header and theme toolbar visible.

Page content is centered and limited to 1056 design units, with 16-unit mobile gutters and
24-unit wide-screen gutters. Each supported catalog entry owns its descriptive subtitle.
The 1024-unit sidebar breakpoint and theme persistence remain shared across page changes.
Theme Builder hides persistent navigation and puts its floating opener at the bottom right.

The preset selector now uses the native anchored Dropdown rather than a modal. Its trigger
and rows share a four-token theme swatch, and the current theme has an individual Lucide
checkmark. Light/dark retains its separate switch; all other presets and a saved custom theme
remain in the dropdown. The editor stays an icon button alongside those controls. Native
playgrounds and property editors are now shared across every implemented component page, as described below.

For this shell update, strict templates, both platform JavaScript bundles, CSS checks,
preset/catalog checks and all 88 native unit tests pass. Android emulator inspection
confirmed the inline brand/version badge, descriptive page headers, narrower page gutters,
base-100 drawer and primary-tinted active route, plus component navigation closing the drawer.
The new anchored theme menu still needs manual interaction confirmation because automated
mirror input was inconsistent. Wide-screen/tablet layout and iOS rendering of this shell
revision have not been visually verified.

### iOS follow-up on the shell revision

A fresh iPhone 17 / iOS 26.5 build installs and launches to Buttons; a blank startup was not
reproduced. Opening/closing the drawer, selecting a component and opening Theme Builder work.
The user reports Android becomes blank immediately at launch; that remains unresolved and
must not be described as fixed by this iOS test.

The iOS pass exposed a separate drawer rendering defect: with the animated drawer, some icons
are absent and footer controls overlap. A static, nonanimated drawer comparison renders those
slots correctly. Simple post-animation layout invalidation and delaying entrance until a
layout event did not resolve it. Those diagnostic changes were removed. The theme picker
cannot yet be considered visually verified on iOS; its hit target is affected by this defect.

### Sidebar rendering correction

The temporary sidebar is now created on first use. Its header, category list and footer keep
a normal native layout throughout presentation. iOS animates a short-lived native snapshot
of that layout, then reveals the live controls; neither the real sidebar nor its full-screen
container receives a transform animation. The backdrop fades separately and the container
stays mounted through sidebar exit. Android retains its shared native view animation.

The presenter uses the shared motion preference/configuration helpers, including reduced
motion and duration scaling. Snapshots are noninteractive and excluded from accessibility;
closing immediately removes live controls from interaction/accessibility. Cancellation and
unload remove pending snapshots and ignore stale completions. An unavailable snapshot falls
back to the live sidebar. The theme selection, drawer scroll position and component state
remain owned by the existing shell.

Verified on iPhone 17 / iOS 26.5: category icons and close button placement, the complete
footer toolbar, theme popup swatches and selected checkmark, live Synthwave selection, and
opening/closing the sidebar. Strict templates, both platform bundles, 88 native unit tests
and six shell/presentation checks pass. No Android emulator was connected for this pass;
the previously reported Android blank startup remains a separate unresolved issue.

## Shared component page UI

All 22 supported component pages have the same structure as the web documentation pages: heading and package entry point, Try it out, a playground card, UI examples with always-visible HTML source, Angular usage, extracted API reference and accessibility guidance. Unimplemented library families remain absent from the native navigation.

The shared native Playground renders an ordinary authored preview under each `*-demo/example` folder. Its toolbar contains individually imported Lucide code, placement and reset buttons. Code expands directly beneath the titlebar. Properties appear beside the preview when the available body width reaches 820 DIP; narrower layouts stack them below. Switching placement retains state, while Reset recreates only the preview and restores its fixture defaults. Page changes reset the controls. Models keep local edits through unrelated input changes.

Every extracted scalar input has a bound preview input: finite literals use Select with typed option identities, booleans use Toggle, and text/numbers use native text controls. Explicit unset/null actions remain distinct from defaults. Complex inputs explain their fixture ownership rather than pretending to edit objects. The API section shares the extracted input descriptions/types. Desktop-width pages show section navigation on the right; mobile uses a compact horizontal section strip. Both scroll smoothly to the target inside the native page ScrollView. At viewport widths of 1320 DIP and above, the shell gives section navigation a separate fixed right-hand column outside the page ScrollView. The page and both sidebars retain independent scrolling/layout; narrower widths use the compact section strip.

Native Webpack applies `tools/playground-loader.cjs` only to plain `playground.ts` modules after Angular compilation. The loader shares the web extractor, resolves native/core classes from source, caches only within a compilation and registers source/type/resource dependencies for rebuilds. Generated metadata and source text remain in memory; Angular type-checking sees the authored optional fields. No generated configuration file is written. Shared types live in the portable core playground entry point and remain re-exported from the existing web path.

The native source viewer renders build-highlighted Shiki tokens as safe native FormattedString/Span text in a read-only TextView. It assembles the entire span list in one batch before assigning it, avoiding quadratic native text updates when long inline sources are shown. It switches light/dark token colors, provides file tabs and puts an accessible copy icon in the current file panel. The clipboard receives the exact authored contents, with no native HTML interpretation or bundled Shiki runtime. Curated inline examples now keep their template in a single component file; the extractor produces the virtual HTML tab in memory. Inline example shells show that HTML by default; full previews offer the complete TS/HTML source set. The existing curated examples remain available after the live playground.

The Theme Builder uses the same theme definitions as all other pages. Its settings and preview sit beside each other at wide widths and stack on phones. All 28 tokens are grouped into base, brand, status, shape/size and effect settings. Depth/noise are retained in exported definitions even where native rendering does not emulate browser textures. Applying a draft updates the global scope; merely editing it changes only the preview.

### Verification of the shared page UI

The web production build and 35 web showcase tests pass, as do four shared extractor/source tests, all 94 native component tests, both native platform bundles, selected-icon/CSS checks and 12 native shell/source/state checks. The new checks cover all 22 extracted configurations, exact authored files, every scalar preview binding, typed literal values, explicit unset/null, all 28 exported tokens and a 5,000-span single-batch source render. The web build reports initial bundle and Theme Builder stylesheet budget warnings.

On iPhone 17 / iOS 26.5, all 22 component pages were opened and showed their live playground, package heading and property metadata. Checked highlighted source display, the toolbar code disclosure, smooth API section navigation, local preview Reset and the expanded Theme Builder's grouped fields and floating navigation control. A rendering stall on long sources was corrected by batching native formatted spans, then the complete catalog was checked again. No Android device/emulator was connected; Android native rendering, the wide/tablet layout, direct keyboard editing/copy/import workflows and a screen-reader audit remain unverified. Native bundling and state checks do not establish those device results.

Literal property controls cache their native Select options by immutable property metadata. Recreating those arrays during change detection would dismiss a presented menu, because Select intentionally closes when its available options change. The cache preserves menu lifetime while retaining typed values, per-property isolation and fresh options when metadata changes.

The select lifetime correction passes both platform bundles, all 94 native tests and 13 shell/source/state checks. Direct iPhone 17 verification opened the playground color menu, confirmed it remained open, selected success and observed the live button preview become green. The simulator was returned to portrait after the interaction check.
