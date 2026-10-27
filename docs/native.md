# Native ngx-daisy

The native product carries the existing design language and component concepts into NativeScript Angular. Components use real native controls and platform interactions, while web and native share semantic APIs and theme definitions.

## Package boundaries

| Package                    | Responsibility                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `@ngx-daisy/core`          | Platform-independent design contracts, theme validation and shared theme definitions  |
| `@ngx-daisy/cdk`           | Existing browser components, DOM/CDK behavior and daisyUI styling                     |
| `@ngx-daisy/native`        | NativeScript components, native theme adaptation and native interaction/accessibility |
| `projects/native-showcase` | Standalone native example app for iOS and Android                                     |

Each component family and theme foundation has a secondary entry point. Root library entry points do not export components. The packages remain private/provisional.

Shared extraction moves the existing Button and Icon type contracts and theme definition/validation into core. Web entry points re-export them to preserve application imports. Web SCSS export stays in the web package. The playground extractor resolves shared contracts from authored source and watches them for changes; it must not fall back to stale built declarations during extraction.

## First delivery

- Zoneless Angular 22 NativeScript bootstrap, with OnPush standalone components and SCSS.
- Native theme scopes, light/dark presets and custom theme conversion.
- A native Button with semantic colors, five variants, sizes, shapes, layouts, disabled/loading/selected state and accessible activation.
- A native showcase with realistic examples and a persisted theme preference.
- Package builds, strict template checks, iOS/Android JavaScript bundles and targeted tests.

The native Button adapts compact sizing to a minimum 44-unit touch target. Loading uses a localizable text label. Dashed borders, icon composition and depth/noise effects are deferred. API differences reflect the native platform and are documented in the [native package guide](../projects/ngx-daisy-native/README.md).

## Next component families

Input, Textarea, Toggle, Checkbox, Radio and Range now provide native Data Input controls with Signal Forms contracts and independent showcase pages; see [native Data Input](native-data-inputs.md). Continue with remaining form controls and Loader. Validate keyboard/focus behavior, accessibility and OS lifecycle on iOS and Android as the catalog expands. Navigation, drawers and overlays need native implementations and native back/dismissal behavior; browser CDK overlays and focus traps do not belong in the native package.

Do not import web components, DOM globals or browser CSS into core/native. Share portable behavior only when both implementations actually need it. Keep platform-specific rendering and interaction within the corresponding package.

## Validation

`yarn build` verifies the existing web distribution; `yarn check:native` builds the native package and AOT platform JavaScript bundles; `yarn test` includes native unit tests alongside existing web, styling, builder and documentation checks. Native unit tests validate Angular bindings and state using the test renderer; they do not claim native rendering correctness.

Running `yarn native:ios` or `yarn native:android` requires a configured native toolchain. Device/simulator checks remain required for native rendering, screen readers, font scaling and touch behavior. See the [showcase setup](../projects/native-showcase/README.md).

## iPhone simulator pass

The showcase builds and runs on iPhone 17 / iOS 26.5. NativeScript iOS 9.1.0 is recorded in the showcase dependencies. Static semantic input aliases are `dsyColor` and `dsyLayout`: NativeScript applies attributes directly to its views, where `color` parses literal colors and `layout` is a native method. Keeping these names distinct avoids startup and layout failures. A regression test covers those static aliases.

Live theme switching, persisted theme selection, button activation and checkout loading/completion were verified in the simulator. The header uses a themed native Label and explicit status bar style for dark-mode contrast; native margin properties keep sample spacing above default component styles. Scrolling was also confirmed manually by the user. Screen readers, font scaling and Android execution remain pending. The Actions/Icon expansion adds further simulator coverage recorded in [native Actions verification](native-actions.md#october-26-verification).

Bundle-only verification writes to `dist/native-check` rather than the `platforms` directories. The iOS launcher can discover Homebrew's isolated CocoaPods gems without changing global Ruby settings.

## Styling reuse

The native showcase uses the official `@nativescript/tailwind` integration with Tailwind 4. The optional `@ngx-daisy/native/tailwind` plugin imports daisyUI's public color and border-radius configuration, keeping semantic utilities aligned without copying browser component CSS. Showcase spacing, typography and surfaces use utilities; native Button interaction and geometry remain in a platform adapter. See the [native styling setup](../projects/ngx-daisy-native/README.md#native-tailwind-styling).

## Native Actions and Icon

The native catalog now includes all six Actions families and Icon: Button, Dropdown, FAB/Speed Dial, Modal, Swap and Theme Controller. Each family has its own secondary entry point and a native showcase example. Modal and Dropdown share NativeScript dialog presentation and reactive detached theme scopes. Swap and Theme Controller use Angular Signal Forms checkbox contracts. Icon projects app-owned artwork. See [native Actions and Icon](native-actions.md) for APIs and explicit platform differences.

The native showcase now follows the web shell with grouped, responsive navigation, independent component pages and shared theme controls. See [native showcase shell](native-showcase.md) for current behavior and verification boundaries.
