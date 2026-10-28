# Native anchored popovers

`@ngx-daisy/native/popover` supplies a reusable, themed view layer for custom Angular/NativeScript content. Dropdown and Select use this layer. They no longer convert content to iOS UIMenu or Android PopupMenu items, and they do not open modal sheets.

## App setup

Provide a NativeScript RootLayout around the app's navigation host. For example:

<!-- prettier-ignore -->
```html
<RootLayout>
  <Frame>
    <Page actionBarHidden="true">
      <!-- app content -->
    </Page>
  </Frame>
</RootLayout>
```

Native Modal also uses a RootLayout inside its presented window. The popover stays inside that window's available bounds. The service requires a loaded anchor and an initialized RootLayout; it reports a configuration error instead of changing the application's root view automatically.

## Generic service

Inject `DsyPopoverService` and call `open(anchorView, templateOrComponent, config)`. Content can be an Angular TemplateRef with multiple native views, or a standalone component type. A template keeps its declaring Angular context and injector; it remains reactive while open. Opening a popover creates fresh content, and closing destroys it.

Config supports:

| Property                      | Behavior                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `label`                       | Visible panel heading and accessible close control                                 |
| `width`                       | A DIP number or `'anchor'` (the default); always bounded to the viewport           |
| `maxHeight`                   | Maximum panel height, 360 DIP by default; long content scrolls                     |
| `placement`                   | Preferred `'auto'`, `'bottom'` or `'top'`; flips when the other side has more room |
| `align`                       | Physical start/left or end/right alignment with the trigger                        |
| `gap`                         | Trigger-to-panel spacing, 6 DIP by default                                         |
| `panelClass`, `backdropClass` | Classes on the panel and full-screen dismissal target                              |
| `theme`                       | Shared theme definition or reactive getter                                         |
| `injector`                    | Parent injector for component content                                              |
| `initialFocus`                | Callback returning the preferred native focus target                               |
| `restoreFocus`                | Restores the loaded trigger on ordinary dismissal by default                       |

The returned reference has an `opened` promise, a replayed/completing `closed` observable and idempotent `close(reason?)`. Close reasons distinguish dismissal, selection, owner disposal, replacement and presentation failure. The service serializes replacement so an outgoing layer finishes cleanup before the next is mounted.

## Interaction and lifecycle

The panel prefers the requested side of its trigger, flips when needed, clamps its width and horizontal position, and limits height to available space with a 12 DIP margin. Coordinates use the native overlay's safe-area coordinate space. Layout changes reposition it; ancestor scrolling, page navigation, anchor unloading or app suspension close it. Content can scroll independently. There is no default animation, so no motion needs to be suppressed for reduced-motion settings.

Outside taps and the visible close button dismiss the layer. Escape is handled by a native iOS responder ancestor and Android key listener; Android Back also dismisses it. If an app already has its own Android `activityBackPressed` handler, give the popover priority before changing routes:

```ts
if (popovers.closeActive()) {
  event.cancel = true;
  return;
}
// Continue app navigation handling.
```

Background root views are hidden from accessibility while a layer is open and restored to their prior state during cleanup. The native iOS layer also supplies modal accessibility scope and the accessibility escape action. Explicit close controls remain available. Focus restoration is skipped when the owner goes away or another popover supersedes it. Custom interactive content still needs meaningful native labels and controls; this layer does not turn arbitrary visual layouts into accessible widgets or add browser CDK keyboard semantics.

## Background separation and accessibility preferences

On iOS, a native [UIVisualEffectView](https://developer.apple.com/documentation/uikit/uivisualeffectview) with System Thin Material blurs the app behind the open popover. A separate dimming scrim further separates the foreground. The menu itself retains its opaque daisyUI theme surface and text colors, keeping readability independent of the content behind it. The material's light/dark variant follows the declaring theme, even when it differs from device appearance. Android uses the dimming scrim and themed opaque menu without UIKit blur.

When [Reduce Transparency](https://developer.apple.com/documentation/uikit/uiaccessibility/isreducetransparencyenabled) or [Increase Contrast](https://developer.apple.com/documentation/uikit/uiaccessibility/isdarkersystemcolorsenabled) is enabled, blur is replaced with a stronger scrim. Preference changes take effect while the popover is open. The native decorative view ignores touches and accessibility traversal; observers and the view are removed when the layer unloads or is disposed. Rotation/layout updates resize the effect behind the panel. No blur animation is introduced.

`backdropClass` still customizes the dismissal scrim; `panelClass` and theme tokens customize the foreground surface. Keep the layer and its ancestors at full opacity, as UIKit visual effects do not support ancestor opacity fading. Keep panel backgrounds opaque and choose accessible foreground/background combinations when overriding defaults. Background blur improves visual separation; it does not replace focus handling, meaningful labels, contrast checks or a screen-reader audit.

## Dropdown content

`ng-template[dsyDropdownContent]` is rendered as authored. Use ordinary Labels, layouts, provider-owned icons and other native views for headers, descriptions, badges or custom items. `DsyDropdownItem` works on Button, GridLayout and StackLayout. It owns guarded activation, closes the dropdown and emits `triggered`; layout items need an explicit `label` and may supply `description` for accessibility. Keep nested independent controls outside an actionable item so touch and accessibility targets do not conflict. Use native Buttons for ordinary actions.

`panelClass`, `panelWidth` (280 DIP default or `'anchor'`) and `maxHeight` customize the panel. Style the trigger through DsyButton. The declaring DsyTheme is reapplied reactively to the detached layer. Item appearance remains overridable through app classes and native properties; `.dsy-native-dropdown-item`, its disabled/destructive modifiers, and `.dsy-native-popover-*` classes supply defaults. Section headings and descriptions are ordinary authored views; the earlier OS-menu `section` metadata does not insert visual content automatically.

## Select options

Select keeps its left-aligned value and decorative trailing chevron. Its panel matches the trigger width, uses shared theme tokens, and applies a choice immediately. Outside dismissal preserves the value. Signal Forms labels, touch/error state, disabled/read-only/hidden guards and native focus forwarding remain intact.

Use `panelClass`, `optionClass`, `maxHeight`, `triggerClass` and `indicatorClass` for visual slots. Import `DsySelectOptionTemplate` to supply a render-only option template:

<!-- prettier-ignore -->
```html
<GridLayout dsySelect [options]="regions" [(value)]="region">
  <ng-template dsySelectOption let-option let-selected="selected">
    <GridLayout columns="*, auto">
      <Label [text]="option.label" [fontWeight]="selected ? '600' : '400'"></Label>
      <Label col="1" [text]="option.value.toUpperCase()" class="text-xs text-primary"></Label>
    </GridLayout>
    <Label [text]="option.description" textWrap="true" class="text-xs opacity-60"></Label>
  </ng-template>
</GridLayout>
```

`$implicit` is the original DsySelectOption and `selected` is a boolean. The option's native Button owns activation, disabled/checked state and accessibility; template contents are decorative and must not contain separate interactive controls. Provider icons remain app-owned. Generic `@ngx-daisy/native/menu` offers the same item renderer for other short action lists, with an optional item template and class.

## Verification

Run `yarn check:native` before `yarn test:native`. Positioning and lifecycle tests cover flipping, clamping, scrolling bounds, cancellation, owner unloading, cleanup, focus restoration and stale selections. Native rendering, touch, Escape, screen-reader behavior and Android Back require simulator/device checks; a JavaScript bundle alone does not verify them.

On iPhone 17 / iOS 26.5, verified rich Dropdown rows with provider icons, descriptions, a badge and a disabled destructive action; a custom row selection updating page feedback; above-trigger positioning; Select's custom option template with region codes and checked/disabled state; below-trigger positioning within safe bounds; immediate selection updating the Angular form; Escape dismissal preserving the value; and restoration of background accessibility-tree entries. This is simulator interaction and tree inspection, not a VoiceOver audit. The native responder regression also checks returning an actual NSArray to UIKit and avoiding a second safe-area offset during child layout.

On the same iPhone simulator, verified background blur behind both Dropdown and Select, a dark material matching the app's dark theme despite the device's light appearance, action/selection dismissal removing the blur and restoring background accessibility entries, repeated opening, and Escape dismissal preserving selection. Blur unit checks cover the native effect's background placement, resize handling, light/dark theme changes, exclusion from hit testing and accessibility, both accessibility preference fallbacks, live preference changes, and observer/view cleanup. Mocked preferences verify the fallback logic; native accessibility preferences still require device validation.

Android execution remains unverified because the local JDK and Android platform/build tools are missing. JavaScript bundles and mocked Android lifecycle paths do not establish rendering, hardware keyboard behavior or Back handling on device. Outside taps, rotation, large font scales and screen-reader operation also need direct device interaction checks.
