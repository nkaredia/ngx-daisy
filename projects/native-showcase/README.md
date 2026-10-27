# ngx-daisy native showcase

A NativeScript Angular app demonstrating all six native Actions families and Icon. Its web-aligned shell includes categorized component navigation, responsive sidebar/drawer layout, persisted preset themes and a small native theme editor.

## Run

From the repository root:

```sh
yarn install
yarn native:ios
# or
yarn native:android
```

The root commands build the shared contracts and native library first. The showcase consumes their packaged entry points from `dist` using TypeScript paths and webpack aliases. It has its own NativeScript build, separate from the web showcase's Angular builder. Bundle-only checks write to `dist/native-check`, keeping `platforms` reserved for complete native projects.

Use `yarn check:native` to validate TypeScript, strict Angular templates and both platform JavaScript bundles without a native SDK. Use `yarn test:native` for Angular state and conversion checks. To refresh library changes during development, rebuild with `yarn build:native` and restart the native showcase.

## Toolchains

Native execution needs the platform runtime plus the corresponding SDK tools:

- iOS: Xcode, an installed iOS simulator runtime or connected device, and configured Ruby `xcodeproj`/CocoaPods tools where required by NativeScript.
- Android: Android SDK/platform tools and a compatible JDK, plus an emulator or connected device.

The iOS launcher detects Homebrew Ruby/CocoaPods when `xcodeproj` is not available through the current Ruby environment. It adjusts only the launched process, without editing shell configuration. For that setup, install `brew install cocoapods` once.

Follow the [official macOS setup guide](https://docs.nativescript.org/setup/macos). Run the local CLI checks through Yarn:

```sh
yarn workspace @ngx-daisy/native-showcase exec ns doctor ios
yarn workspace @ngx-daisy/native-showcase exec ns doctor android
```

The NativeScript project selects its modern Yarn adapter (`yarn2`, also used for Yarn 4). The workspace inherits the root node-modules linker and lockfile. Do not install a global CLI or create an npm lockfile. NativeScript adds platform runtime dependencies when preparing the selected platform; review and retain those changes in the Yarn workspace.

The initial app resources come from the official NativeScript Angular blank starter. Android cleartext access is restricted to local development hosts, and unused storage permissions have been removed.

## Verification boundary

Both platform JavaScript bundles and Angular templates can be checked without device tools. Final visual layout, touch behavior, font scaling, VoiceOver/TalkBack, theme propagation into native views and operating-system lifecycle behavior still require simulator/device verification. The showcase has now been built, installed and launched on iPhone 17 with iOS 26.5. Simulator checks verified live light/dark switching, theme persistence across reloads, native button activation updating Angular state, and the checkout disabled/loading/completion flow. Header contrast and button spacing were corrected during that pass. Native scroll metrics report content beyond the viewport, but automated swipe/scroll gestures did not move the view in this session; manual scrolling and lower-section visual inspection remain pending. VoiceOver/TalkBack, font scaling and Android execution also remain to be checked.

## Tailwind and daisyUI tokens

The showcase uses NativeScript's official Tailwind 4 integration. Global SCSS imports Tailwind's theme and utilities without browser preflight, then loads the native package's reusable Tailwind plugin. Semantic colors and corner radii come directly from daisyUI's public configuration. Layout, typography and surface examples use utility classes; NativeScript layouts and the Button's native interaction adapter remain platform-specific.

`yarn check:native` also compiles and checks these utilities. See the [native package styling guide](../ngx-daisy-native/README.md#native-tailwind-styling) for consuming-app setup.

The showcase has a shared responsive navigation shell with an independent page for each supported component. Actions examples demonstrate the shared native Dropdown/Modal presenter, speed dial, a Swap bound to Signal Forms, and a Theme Controller scoped to one card. Icons demonstrates provider-independent projection with individually imported Lucide and Font Awesome SVG artwork. See the [native Actions guide](../../docs/native-actions.md).

See [native icon packs](../../docs/native-icons.md) for the native SVG setup, per-icon imports, styling and bundle checks.

See [native showcase shell](../../docs/native-showcase.md) for navigation, responsive layout, preset themes and the native theme editor.

Data Input has dedicated Input, Textarea and Toggle pages with Signal Forms validation, live text previews and native notification switches. See the [native Data Input guide](../../docs/native-data-inputs.md).
