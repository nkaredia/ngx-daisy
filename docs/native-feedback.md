# Native feedback

Alert, Progress and Skeleton have separate secondary entry points under `@ngx-daisy/native` and dedicated native showcase pages. All use inherited theme tokens and NativeScript rendering; no browser CSS or DOM interactions are imported.

## Alert

Import `DsyAlert` from `@ngx-daisy/native/alert` and use `StackLayout[dsyAlert]`:

```html
<StackLayout
  dsyAlert
  dsyColor="warning"
  variant="soft"
  title="You are offline"
  message="Keep working. Your changes will sync when you reconnect."
>
  <button dsyButton text="Reconnect" (pressed)="reconnect()"></button>
</StackLayout>
```

`dsyColor` accepts `inherit`, `info`, `success`, `warning` and `error`. `variant` supports `solid`, `outline` and `soft`. Individual Lucide status icons are library-owned and decorative; `iconClass` and `contentClass` expose their visual slots. Titles wrap and use native heading semantics; messages wrap independently. Projected actions remain real app-owned controls. Alerts persist until the app removes them, with no timer, focus capture or dismissal ownership.

`announcement` (`polite`, `assertive`, `off`) configures the message's Android accessibility live region. NativeScript's iOS live-region setter does not post VoiceOver announcements; the application owns iOS announcement timing. Projected content likewise owns its accessibility. Do not announce initial static examples repeatedly. Dashed borders and browser orientation rules are not exposed; native layouts inside the projected content remain app-owned.

## Progress

Import `DsyProgress` from `@ngx-daisy/native/progress`. The GridLayout wrapper contains the native OS `Progress` view when `value` is finite, or an OS `ActivityIndicator` when the amount of work is unknown.

```html
<GridLayout
  dsyProgress
  [value]="completed()"
  [max]="total()"
  dsyColor="primary"
  label="Uploading files"
/>
<GridLayout dsyProgress dsyColor="primary" label="Connecting to your workspace" />
```

`value` defaults to `null`. Finite values clamp to `[0, max]`; invalid/nonpositive `max` uses 100, and nonfinite values use the indeterminate presentation. Numeric strings are accepted for static attributes. `label` names the accessible progress region and its value describes the percentage or “In progress”; internal indicators are decorative to avoid duplicate traversal. Keep the app's source values unchanged for business logic. `indicatorClass` styles the native indicator slot; `dsyColor` accepts the semantic palette without shadowing NativeScript's literal foreground `color` property.

The platform controls indicator geometry and indeterminate animation, like native switches and sliders. This is a busy spinner for unknown work, rather than daisyUI's browser-specific sweeping bar. Apps supply visible descriptive text, cancellation actions and busy-region interaction policy. The component neither polls nor advances progress itself.

## Skeleton

Import `DsySkeleton` from `@ngx-daisy/native/skeleton`. `StackLayout[dsySkeleton]` provides an empty decorative shape:

```html
<StackLayout dsySkeleton shape="circle" marginBottom="12" />
<StackLayout dsySkeleton shape="text" width="70%" horizontalAlignment="left" />
<StackLayout dsySkeleton height="140" [animate]="false" />
```

`shape` is `box`, `circle` or `text`. Native width, height, radius and styling properties remain app-overridable. Skeletons contain no projected content, interaction or accessible descendants. Place a single meaningful loading label on the surrounding region; replace the placeholders with actual content when loading completes. The app owns loading state.

`animate` defaults to true and enables a gentle 1.6-second opacity pulse only while loaded and visible. `hidden` collapses the shape and removes the animated class. Unload removes it as well. NativeScript owns and cancels the CSS animation; no application timers or asynchronous animation loops are created. Shared `DSY_MOTION_CONFIG` opt-out (including durationScale zero) and OS reduced-motion settings disable the pulse. Preferences are checked on load and app resume; pause is also directly controllable with `animate`. Nonzero shared durationScale does not change this CSS pulse's fixed duration. A static placeholder remains when motion is disabled.

## Validation boundaries

Native unit checks cover bounded/indeterminate progress, projected recovery actions, Android live-region bindings and pulse removal across pause, hide, unload and disabled-motion reload. CSS checks compile the three stylesheets through the NativeScript adapter and verify theme dependencies and the pulse keyframes. Platform bundles do not establish device rendering or screen-reader behavior.

This delivery passes `yarn check:native` (strict templates, both platform bundles, CSS and selected-icon checks, six shell checks) and all 94 native unit tests. iPhone 17 / iOS 26.5 checks cover the three showcase pages, alert recovery, progress changes/custom maximum, unknown-duration presentation, pulse/pause and loaded-content replacement, plus light/dark theme switching. Android rendering and screen-reader testing remain pending; no Android runtime was connected during this pass.
