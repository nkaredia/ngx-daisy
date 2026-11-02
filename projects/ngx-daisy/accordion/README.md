# @ngx-daisy/cdk/accordion

Standalone Angular accordion family with daisyUI styling. See the [Data Display guide](../../../docs/data-display.md) for exports, examples, behavior and customization.

## daisyUI alignment

Items share the native grid expansion behavior in Collapse. Angular Aria supplies keyboard/focus interaction for the enabled built-in Collapse triggers. CDK retains single/multiple expansion coordination and the existing `openAll()` / `closeAll()` facade, including compatibility with custom trigger templates. The group remains on the existing host, so projected items remain direct children and app layout utilities continue to work.

Up/Down and Home/End navigate the enabled built-in triggers without changing expansion. Navigation stops at the group boundaries; use Enter/Space or click to toggle. Native-disabled and caller-owned custom triggers remain outside that Aria navigation list. Custom triggers retain their native Tab/click behavior.

`@angular/aria` is a library peer. Keep its version aligned with Angular CDK (22.2.3 is the currently tested pair). No new application provider or markup is required.
