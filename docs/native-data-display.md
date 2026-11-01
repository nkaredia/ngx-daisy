# Native content composition

Card and Badge are available through `@ngx-daisy/native/card` and `@ngx-daisy/native/badge`. Divider lives at `@ngx-daisy/native/divider`. Each has an independent native showcase page, with shared theme selection preserved across pages.

```html
<StackLayout dsyCard border="solid">
  <StackLayout dsyCardBody>
    <label dsyCardTitle text="Order #2048"></label>
    <label dsyBadge text="In transit" dsyColor="info" variant="soft"></label>
    <GridLayout dsyDivider></GridLayout>
    <label text="Arriving tomorrow" textWrap="true"></label>
    <FlexboxLayout dsyCardActions>
      <button dsyButton text="Track delivery" dsyColor="primary"></button>
    </FlexboxLayout>
  </StackLayout>
</StackLayout>
```

Import `DsyCard`, `DsyCardBody`, `DsyCardTitle`, `DsyCardActions`, `DsyBadge`, `DsyDivider` and `DsyButton` from their corresponding secondary entry points in the standalone component. NativeScript's common module supplies native layout registration.

## Badge

Use `Label[dsyBadge]` with a `text` input, semantic `dsyColor`, `size` (`xs`–`xl`) and `variant` (`solid`, `outline`, `soft`, `ghost`). It is an ordinary, noninteractive native label, wraps longer text and uses the selector radius token. Literal native `color`, font and background properties remain available for application overrides. Use an accessible Button for actionable chips, and put changing status announcements under app ownership.

Dashed borders are not exposed: NativeScript's common border renderer does not supply a portable dashed border. No badge imposes a web-sized touch target because it is not an action.

## Card

`StackLayout[dsyCard]` is a noninteractive container with `size` (`xs`–`xl`) and `border` (`none`, `solid`). `StackLayout[dsyCardBody]` supplies size-dependent padding. `Label[dsyCardTitle]` wraps its text and supplies native heading semantics. `FlexboxLayout[dsyCardActions]` wraps explicit native actions rather than turning the whole card into a button.

All content remains app-owned native markup: images, labels, layout and actions can be composed directly. Host classes and native style properties customize each slot. Cards inherit their parent background and text color by default, matching daisyUI. Add surface utilities such as `bg-base-200`; the box radius and border use theme tokens. Use native layouts explicitly for side-by-side media or image overlays; web `side`, `imageFull` and dashed borders are not silently emulated. Image clipping/cropping remains on the app-owned Image and its container.

## Divider

`GridLayout[dsyDivider]` accepts optional `text`, semantic `dsyColor`, `orientation` (`horizontal`, `vertical`) and label `align` (`center`, `start`, `end`). A vertical divider needs a bounded parent height, for example a fixed-height GridLayout row. Empty labels reserve no label space. `lineClass` and `labelClass` customize the internal visual slots; native host properties can override margins and text color.

Dividers are decorative and excluded from accessibility traversal. Put meaningful section titles in native heading labels outside the divider. No animation, timer or focus behavior is introduced by these display-only families.

## Validation boundaries

Unit checks cover projected action continuity, status changes, heading semantics and divider reflow. Native CSS checks compile all three families through the NativeScript Tailwind adapter and verify theme-token use. Platform bundles and simulator presentation are separate checks; passing a bundle does not establish screen-reader or device rendering correctness.

The delivery passes `yarn check:native` (strict templates, iOS/Android bundles, native styling, selected icon modules and six shell checks) and 91 native unit tests. iPhone 17 / iOS 26.5 rendering checks cover all three pages, badge sizes/variants, horizontal and vertical dividers, live light/dark theme changes and an invitation action update. Android rendering, screen-reader behavior and large font settings remain unverified in this pass because no Android runtime was connected.
