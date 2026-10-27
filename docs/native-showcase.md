# Native showcase shell

The native showcase follows the web showcase's shell: grouped navigation, ngx-daisy/version branding, a mobile navigation opener, persistent wide-screen sidebar, and a fixed footer containing light/dark, preset selection and Theme Builder controls. It uses NativeScript views, the shared design tokens and Tailwind utilities rather than embedding the browser site.

## Navigation and layout

`projects/native-showcase/src/app/shell/catalog.ts` drives labels, categories and page selection. The implemented native catalog has thirteen pages: Buttons, Dropdowns, FAB / Speed Dial, Modals, Swaps, Theme Controllers, Icons, Input, Textarea, Checkbox, Radio, Range and Toggle. Categories follow the web order: Actions, Data Display, then Data Input. Unimplemented native families do not have dead navigation entries.

Below 1024 DIP, a titlebar shows the navigation button and brand/version. The drawer shows Components and a close button, avoiding duplicate branding. The drawer overlays its backdrop, disables and hides the underlying page from accessibility, and closes when selecting a page or tapping the backdrop/close control. On Android, Back closes the drawer first and returns other component pages to Buttons before the normal root behavior.

At 1024 DIP and above, the sidebar occupies its own 288-DIP column and the titlebar is omitted. The Theme Builder hides permanent navigation and the titlebar at every width, providing a floating navigation trigger instead. Layout changes recalculate the mode. Only the category list scrolls inside the sidebar; its header and theme footer remain visible. Component page content scrolls independently and resets to the top after navigation.

Button examples now live in their own component. Each Actions family can be selected independently through the catalog, while shared example rendering stays outside the shell. The shell's reusable icon-button component keeps a real native Button for activation/accessibility and projects noninteractive artwork above it. The library's Icon remains provider-independent.

## Themes

The preset catalog imports daisyUI's public `theme/object` and `functions/themeOrder` data. All 35 built-in definitions pass through the shared theme contract and native color/length converter. Browser CSS is not imported. Light/dark remain a separate switch; other presets appear in a native picker with each theme's four-color swatch. The selection persists across page navigation and app restarts. Native checked-property echoes do not override a selected preset.

The native Theme Builder is a smaller editor than the browser generator. It edits primary/secondary colors and field radius, validates the converted theme before applying it, previews shared component styling, and saves one custom theme locally. The saved theme is also selectable in the picker. It does not yet reproduce the web generator's complete token editor, import/export or share-link UI.

The picker uses the existing native Modal family, retaining explicit dismissal and detached theme scope support. Sidebar navigation itself is currently app-owned native layout, not a new library Drawer implementation. No custom drawer animation is applied.

## Verification

`yarn check:native` builds the packages, checks strict templates, creates iOS/Android JavaScript bundles, checks Tailwind output and selected icon modules, and runs artwork/preset/catalog checks. `yarn test:native` covers native component state and renderer contracts. The shell checks ensure every built-in preset converts to native tokens and every supported component has exactly one category entry.

Screen-reader interaction, Android native rendering/back behavior, tablet layout and larger font scales require device verification; compilation and unit tests do not establish those results.

### iPhone verification

Verified on iPhone 17 / iOS 26.5: mobile branding/version; Lucide menu, close, category and footer icons; dimmed backdrop dismissal; background removal from the accessibility tree while navigation is open; component selection closing the drawer; preset swatches and Synthwave selection; independent light/dark switching; native custom color editing; custom theme persistence after restart; and the builder's floating navigation trigger. These are simulator interactions and accessibility-tree inspection, not a screen-reader audit.

Strict templates, both platform bundles, selected-icon checks, all 35 preset conversions, the catalog checks, three artwork tests and 23 native unit tests passed. Tablet rendering and Android device behavior remain unverified.

The Data Input expansion adds account details with validation, a live bio editor and notification preferences. See [native Data Input](native-data-inputs.md) for APIs and verification.
