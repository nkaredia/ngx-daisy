# Native interaction motion

Native components share `@ngx-daisy/native/motion`, using NativeScript's cancellable native animation engine on iOS and Android. No browser animation runtime or animation package is required. See the [NativeScript animation guide](https://docs.nativescript.org/guide/animations).

| Interaction                                | Motion                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| Button, including dropdown/select triggers | Brief press compression and release                                      |
| Checkbox, radio and swap                   | Press feedback plus a short settling animation when the model changes    |
| Dropdown and select popovers               | Panel fades/scales in over 180 ms, out over 120 ms; backdrop stays clear |
| FAB actions                                | Fade/slide in and out, retaining closing views until the exit finishes   |
| Compact dialog                             | Native OS presentation and dismissal transitions                         |
| Showcase temporary navigation              | Slide/fade in and out; persistent sidebar remains stationary             |
| Toggle, theme controller and range         | Existing OS-owned switch/slider interactions                             |

Text editing, focus and keyboard behavior stay owned by the native controls. Static content, icons and form labels do not animate merely because they render. Form values and activation outputs update immediately, independently of animation completion.

## Configuration

Provide an optional application-level preference:

```ts
import { DSY_MOTION_CONFIG } from '@ngx-daisy/native/motion';

// In application bootstrap providers:
{ provide: DSY_MOTION_CONFIG, useValue: { enabled: true, durationScale: 0.75 } }
```

The default duration scale is 1. `enabled: false` or `durationScale: 0` disables library motion. Custom animation durations scale between 0 and 4; OS dialog transitions keep OS timing. Dialog callers can still request `nativeOptions: { animated: false }`.

The current iOS Reduce Motion preference and Android animator enablement/duration-scale setting are checked when each interaction starts. System accessibility preferences take precedence over application configuration. Disabling motion applies final visual states immediately and preserves dismissal and model updates. Changing a system setting during an already-running transition takes effect on the next interaction.

`DsyMotionPresence` can retain a native layout through an exit:

```html
<GridLayout [dsyMotionVisible]="opened()" [motionFromX]="-288">
  <!-- App-owned panel content -->
</GridLayout>
```

Import the standalone directive. Keep this host mounted; an outer `@if` would remove it before its exit can finish. The directive owns host visibility, opacity and translation. Closing content becomes noninteractive and hidden from accessibility immediately. Other components, such as a navigation drawer, must still own focus and background accessibility coordination.

Replacement animations cancel earlier work; stale exit completions cannot hide reopened content. Unloaded controls release animation/listener resources. Default shared motion does not add infinite animations.

## Verification

Native strict templates, both platform JavaScript bundles and regression tests cover preference handling, final states without motion, cancellation, replacement and retained exits. iPhone 17 simulator checks cover navigation, popover opening/dismissal, FAB actions and compact dialog opening/dismissal. Bundle and unit checks do not establish Android rendering; Android device validation remains pending toolchain setup.
