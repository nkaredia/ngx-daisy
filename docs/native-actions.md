# Native Actions and Icon

The six Actions families have native entry points under `@ngx-daisy/native`: Button, Dropdown, FAB/Speed Dial, Modal, Swap and Theme Controller. Icon remains a provider-independent projection wrapper. These use NativeScript views rather than browser components or browser CDK. Shared Button and Icon palette contracts come from `@ngx-daisy/core`.

## Imports and platform differences

| Entry point         | Public building blocks                                                       | Native behavior                                                                        |
| ------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `/button`           | `DsyButton`                                                                  | Real native Button; see the package guide                                              |
| `/dropdown`         | `DsyDropdown`, `DsyDropdownTrigger`, `DsyDropdownContent`, `DsyDropdownItem` | A themed custom anchored NativeScript popover                                          |
| `/fab`              | `DsyFab`, `DsyFabTrigger`, `DsyFabAction`, `DsyFabClose`                     | Expandable projected actions within a native StackLayout; the app positions the layout |
| `/modal`            | `DsyModal`, `DsyModalService`, `DsyModalConfig`, `DsyModalContext`           | Template-backed, compact centered NativeScript dialog                                  |
| `/swap`             | `DsySwap`                                                                    | A native Button swaps text/glyph labels and checked state                              |
| `/theme-controller` | `DsyThemeController`, `DsyThemeControllerChange`                             | A native Switch emits theme intent; the app applies/persists it                        |
| `/icon`             | `DsyIcon`, `DsyIconColor`                                                    | A native GridLayout projects app-owned artwork                                         |

Import each used standalone component/directive into the consuming component. NativeScript element names are case-sensitive. Use `NativeScriptCommonModule` and `NO_ERRORS_SCHEMA` as usual. Use `dsyColor` for semantic names, avoiding NativeScript's literal `color` property. Do not combine multiple component selectors on the same element: Swap and Theme Controller own their native Button/Switch rather than also taking `dsyButton`.

## Dropdown

<!-- prettier-ignore -->
```html
<StackLayout dsyDropdown label="Project actions">
  <Button dsyButton dsyDropdownTrigger text="Manage project"></Button>
  <ng-template dsyDropdownContent>
    <Button dsyButton dsyDropdownItem text="Duplicate" (triggered)="duplicate()"></Button>
    <Button dsyButton dsyDropdownItem text="Unavailable" disabled></Button>
  </ng-template>
</StackLayout>
```

Use exactly one trigger and content template. `opened` is a boolean model; `open()`, `close()` and `toggle()` are also available through `exportAs="dsyDropdown"`. `disabled` prevents opening and closes an active panel. Content is live Angular markup, recreated on each opening and destroyed on closing. It supports native layouts, provider-owned icons, badges, headers and custom action rows.

`DsyDropdownItem` accepts Button, GridLayout or StackLayout hosts. It guards disabled/stale activation, closes the panel and emits `triggered`. Give layout items an explicit `label`; `description` supplies accessible help. Section headings and visible secondary text are ordinary authored views. `destructive` provides the theme's error foreground. Keep independent interactive controls outside actionable rows.

`panelClass`, `panelWidth` (280 DIP or `anchor`) and `maxHeight` customize the panel. The trigger remains an ordinary DsyButton. RootLayout setup, positioning, theme inheritance, Escape/Back/outside dismissal and custom Select option templates are documented in [native anchored popovers](native-popover.md).

## Modal

<!-- prettier-ignore -->
```html
<Button dsyButton text="Create project" (pressed)="create.open()"></Button>
<ng-template
  dsyModal
  #create="dsyModal"
  label="Create project"
  (closed)="handleResult($event)"
  let-dialog
>
  <Label text="Start a private workspace" textWrap="true"></Label>
  <Button dsyButton text="Create" (pressed)="dialog.close('created')"></Button>
</ng-template>
```

`DsyModal` is a template directive. It supports the `opened` model, `open()`, `close(result?)`, `toggle()`, `disableClose`, `label`, `panelClass`, `panelWidth` (320 DIP default), and `closed` output. An opening creates fresh content. Closing the owner closes its presentation; subscriptions are cleaned up with its lifetime. `disableClose` protects native implicit dismissal while explicit controls remain available. Presentation options are captured when opened.

`DsyModalService.open(template, config)` supports data, theme, width, panelClass, label, disableClose, viewContainerRef and NativeScript `nativeOptions`. It returns a NativeScript dialog reference with `close(result)` and lifecycle observables. The template receives the dialog as `$implicit` and optional `data`. Use `DsyModalContext<Data, Result>` (whose `$implicit` is a guarded `DsyModalHandle<Result>`) for typed templates/services. Template directives capture the nearest `DsyTheme` scope; the service defaults to the light preset unless given a theme definition or a reactive theme getter.

Modal uses a themed, scrollable card and NativeScript `NativeDialog` lifecycle. The card is centered and bounded to 560 DIP or the available height minus 96 DIP, whichever is smaller. Native presentation handles modal isolation, dismissal and navigation; there is no DOM focus trap, body scroll lock or fake in-page overlay. The root presenter avoids trying to present from an Angular comment anchor. Themes are reapplied to the detached root and remain reactive. On iOS, over-full-screen native presentation preserves the page behind a dimmed backdrop instead of opening a system sheet. Android uses a compact native dialog window. Custom motion is disabled by default; apps can opt into native presentation animation through service options. OS-specific dismissal behavior, accessibility and nested presentation still need platform validation.

`panelClass` targets the inner content surface. NativeScript component styles can load after global utilities; use app native properties/global component overrides where ordering matters. Choose a panel width suitable for the target screen; the default is clamped to leave horizontal screen margins. Browser placement modes and backdropClass do not transfer to native presentation.

## FAB / Speed Dial

<!-- prettier-ignore -->
```html
<StackLayout dsyFab horizontalAlignment="right" verticalAlignment="bottom">
  <Button dsyButton dsyFabAction text="New note" (triggered)="createNote()"></Button>
  <Button dsyButton dsyFabClose text="Cancel"></Button>
  <Button
    dsyButton
    dsyFabTrigger
    text="+"
    shape="circle"
    accessibilityLabel="Quick create"
  ></Button>
</StackLayout>
```

`opened` is a model; `open()`, `close()` and `toggle()` are exposed through `exportAs="dsyFab"`. A disabled dial closes and prevents opening. Actions accept disabled state, close the dial on activation and emit `triggered`. Closed actions are collapsed, disabled and hidden from accessibility; synthetic activation is guarded. Put this StackLayout into a native GridLayout overlay cell for floating placement. The app owns screen insets and positioning. No web fixed positioning, flower layout, hover activation or custom animation is emulated. A single FAB can be an ordinary circular DsyButton.

## Swap and Signal Forms

<!-- prettier-ignore -->
```html
<Button
  dsySwap
  [(checked)]="soundEnabled"
  label="Notification sounds"
  onText="Sound on"
  offText="Sound off"
  dsyColor="primary"
></Button>
```

Inputs: `checked` and `indeterminate` models, `disabled`, `label`, `onText`, `offText`, `indeterminateText`, `dsyColor` and `size`. Activation clears indeterminate, toggles checked and emits `touch`. The native accessibility label stays stable while accessibility value describes the current state. Supply localized text for labels. Browser flip/rotate animations and projected on/off slots are not part of this initial native API; labels can contain app-owned font glyphs.

Swap implements Angular 22 `FormCheckboxControl` with `checked` and `touch`, so it can use `[formField]="preferencesForm.sound"` from Signal Forms instead of owning a separate checked model. The native showcase demonstrates this. No parallel CVA was added.

## Theme Controller

<!-- prettier-ignore -->
```html
<Switch
  [dsyThemeController]="darkTheme"
  [(checked)]="dark"
  label="Dark appearance"
  (changed)="applyTheme($event)"
></Switch>
```

The required theme is a complete shared `DsyThemeDefinition`. `changed` emits `{ theme, checked }` for a changed native checked value. Bind `checked` or Signal Forms, and use `disabled` as needed. Property echoes do not re-emit an action. Apps own what an unchecked value means, scope selection, coordination and persistence; this control does not change a global theme implicitly. It implements the same Signal Forms checkbox contract. Its visual is the OS Switch, with standard NativeScript styling properties; browser daisyUI `:has` theme controllers are not used.

## Icon

<!-- prettier-ignore -->
```html
<GridLayout dsyIcon [size]="24" dsyColor="success" label="Saved">
  <Label text="✓" accessible="false"></Label>
</GridLayout>
```

`DsyIcon` owns a native GridLayout, not the artwork. `size` is a positive finite DIP number (24 default), `dsyColor` is an inherited or semantic shared color, and optional `label` gives the wrapper image semantics. Unlabeled icons are decorative and hidden from accessibility. Label the button rather than its icon when used as a control. Projected content must be decorative/noninteractive and avoid duplicate announcements.

The wrapper sizes projected Labels using `--dsy-native-icon-size`, supplies their semantic text color, and supplies Image `tint-color` for semantic colors. Apps own font registration, images, icon packages, imports and tree shaking. Provider components should expose or inherit size/color; explicit provider/native properties can take precedence, and custom plugin views may need their own supported styling API. There is no default icon provider, registry or browser SVG adapter. The showcase now demonstrates actual Lucide and Font Awesome vectors through an app-owned native SVG renderer. See [native icon packs](native-icons.md) for imports, registration, bundle checks and styling.

## Validation

Run `yarn check:native` for package builds, strict templates, both platform bundles and Tailwind checks; `yarn test:native` for state and renderer-binding checks. Native presentation is mocked in the unit environment. Use the simulator/device for rendering, modal presentation, results, dismissal and platform accessibility. A successful Android JavaScript bundle is not Android device verification.

### October 26 verification

The native package build, strict showcase templates, iOS/Android AOT JavaScript bundles and Tailwind semantic utility checks passed. The complete regression suite passed: 117 web library tests, 35 showcase tests, 23 native tests, 14 CSS configurations, four builder tests and 72 documentation examples.

On iPhone 17 / iOS 26.5, verified Dropdown presentation, disabled item appearance, selection/result dismissal; Modal presentation and a returned creation result; speed-dial expansion, selection and collapse; Swap updating its Signal Forms value and visible feedback; Theme Controller switching a scoped card; and Icon sizes, semantic colors and decorative/labeled accessibility-tree entries. This was simulator interaction and accessibility-tree inspection, not a VoiceOver audit. Android device rendering, screen-reader operation, larger font scales and nested modal dismissal remain unverified.

## Custom popover migration

`@ngx-daisy/native/popover` is the reusable RootLayout-backed presentation foundation. `@ngx-daisy/native/menu` uses it for standard, optionally templated menu rows. The earlier UIMenu/PopupMenu bridge and `DSY_NATIVE_MENU_PRESENTER` token have been removed. Dropdown now renders its authored template directly instead of extracting item metadata. Select permits custom `dsySelectOption` templates.

Use app classes/native properties and theme tokens for custom surfaces. Add RootLayout around the app's Frame, give popovers priority in app-owned Android Back handling, and follow the [popover guide](native-popover.md) for focus and cleanup boundaries. The historical October 26 checks above predate this presentation change.
