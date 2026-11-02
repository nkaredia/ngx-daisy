# Angular Aria adoption evaluation

Evaluated on November 1, 2026 against the installed Angular, CDK and Aria **22.2.3** packages. This is an adoption spike, not a migration or an accessibility certification.

## Implementation follow-up

The Accordion/Collapse pilot has now adopted Aria for enabled built-in triggers and panel relationships while retaining CDK expansion coordination for compatibility with legacy custom templates. Native-disabled triggers remain native-only and are omitted from the enabled-trigger navigation list. This deliberately keeps one existing expansion coordinator for both kinds of trigger; it is not a wholesale replacement of CDK. Tabs and Dropdown remain unchanged. See the component READMEs for the shipped contract. The evaluation observations below describe the original isolated probes, before this implementation.

## Decision

Adopt selectively through our existing `dsy` components. Start with an **Accordion/Collapse adapter pilot**, then resolve the Tabs projection boundary, then prototype Dropdown's menu mode with its real overlay lifecycle. Keep CDK overlays, theme propagation, focus traps and announcement services where they already serve the library.

Angular Aria supplies headless interaction directives, so it fits our separation between Angular behavior and daisyUI appearance. It does not replace daisyUI styling, every CDK service, native HTML semantics or application accessibility responsibilities. See the [official overview](https://angular.dev/guide/aria/overview).

No shipped component, showcase route or public entry point imports Aria in this evaluation. The exact-version dependency is development-only, and the probes live in `projects/showcase/src/app/aria-evaluation/aria-evaluation.spec.ts`. An eventual library migration needs an explicit peer-dependency decision; this dev dependency is not sufficient for shipping Aria-backed components.

## Compatibility findings

| Family                | Current foundation                                                                          | Evaluation result                                                                                                                                                                             | Work before adoption                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accordion / Collapse  | CDK accordion coordination with our native trigger, signal state and disclosure motion      | A host-directive Aria group coordinates triggers inside nested collapse components. Single and multiple expansion pass.                                                                       | Preserve standalone Collapse, `opened`, `multi`, `openAll` / `closeAll`, disabled behavior, focus restoration, custom trigger templates and exit animation.              |
| Tabs                  | CDK FocusKeyManager, numeric selection, projected buttons and indexed panels                | Canonical Aria tabs pass automatic/manual selection, disabled-item skipping, relationships and eager-content persistence. Our internal-list projection shape fails without a context adapter. | Resolve the logical injection boundary, map numeric indices to string values, retain typeahead and preserve existing hidden/inert, disabled and focus-recovery behavior. |
| Dropdown menu mode    | CDK connected overlay, app-declared TemplateRef, custom item registration and focus manager | Direct menu selection and disabled-item rejection pass. A public `MENU_COMPONENT` injector bridge connects externally declared items to their rendered menu.                                  | Exercise that bridge in the actual CDK portal, including repeated creation/destruction, closing, focus, hover, model synchronization, nested menus and directionality.   |
| Dropdown content mode | Nonmodal content panel with ordinary form controls                                          | Outside the menu pattern's scope.                                                                                                                                                             | Retain the current content implementation and native Tab behavior; do not assign menuitem semantics to forms.                                                            |

### Accordion: suitable first pilot, with compatibility work

Aria's `multiExpandable` maps naturally to our `multi`. The prototype retains eager projected content when a panel closes. This is distinct from Aria's optional lazy template content, which is removed on collapse by default unless preserved. See the [Accordion guide](https://angular.dev/guide/aria/accordion).

A trigger requires an accordion-group injection context. Our standalone `dsy-collapse` currently works without an authored `dsy-accordion`, so a production adapter needs a local fallback group without breaking the surrounding group when present. The negative standalone probe documents that requirement. Aria names its public group commands `expandAll` and `collapseAll`. Our existing `openAll` / `closeAll` facade still needs to be preserved.

Our custom button-only disclosure variation and its caller-supplied trigger template need a separate adapter design. Keep content inert immediately on close while retaining the exiting visual content for our existing reduced-motion-aware transition. Aria's panel state alone does not implement that visual lifecycle.

### Tabs: behavioral fit, structural blocker to a drop-in replacement

Aria uses string `value` identifiers and a `selectedTab` model. Map `automatic` to `selectionMode="follow"`, `manual` to `"explicit"`, and explicitly retain roving focus, wrapping and hard-disabled skipping. See the [Tabs guide](https://angular.dev/guide/aria/tabs).

In the exact structure we tested, a projected `ngTab` cannot inject the `TAB_LIST` provided on a div created inside the wrapper's own view. DOM placement through `ng-content` does not change Angular's logical injector ancestry. Merely adding host directives to `DsyTab` and an internal list will fail. Aria publicly exports `TABS` and `TAB_LIST`, but a viable bridge must be proven without fabricating a partial directive or depending on underscored pattern fields. An explicit public tab-list composition is another option, with API migration implications.

The current DsyTabs enables label-based typeahead. The Aria probe does not move or select Billing on a `b` key, so that behavior needs an adapter or an explicitly approved change. Do not silently remove it.

Aria applies `inert` to inactive panels but does not add `hidden` in the tested eager-content case. Our wrapper must keep its existing visual hiding, preserved DOM/form state, native disabled safeguards and focus recovery. Native daisyUI classes and the lifted-panel seam fix remain appearance responsibilities.

### Dropdown: retain CDK and bridge template context

Aria's own [Menu guide](https://angular.dev/guide/aria/menu) composes its directives with CDK connected overlays. The technologies are complementary.

Our menu items are declared inside an application template and instantiated inside the overlay. A menu directive on the resulting DOM parent does not automatically become their injection parent. The negative probe gets a null item parent; supplying a child injector with the public `MENU_COMPONENT` token fixes registration in the isolated outlet prototype. This proves a supported mechanism, not a completed production overlay adapter.

Use `softDisabled=false` to preserve our skipped-disabled-item behavior; the inspected Aria menu/tab-list/group defaults are soft-disabled. Keep hover timing, outside pointer/focus dismissal, Escape/Tab handling, `open(false|'first'|'last')`, trigger focus restoration, inherited theme variables, viewport fallbacks, `panelClass`, `opened` ownership and teardown. Validate selection emits exactly once with native buttons/anchors before replacing our `triggered` facade.

## Versioning, styling and scope

Aria 22.2.3 requires CDK exactly 22.2.3, while its core peer accepts Angular 22/23. Our installed versions satisfy those peers. Upgrade Aria and CDK together, and recheck this coupling before publishing a library peer range.

The probes keep native daisyUI classes on the same elements and introduce no styling overrides. They do not constitute rendered prefix/theme parity checks. A production pilot must preserve `injectDaisyUIClasses`, conditional prefix aliases, unprefixed source-detection literals, theme tokens, class/slot overrides and the existing fourteen-configuration CSS matrix. No colors or component sizes should change.

NativeScript is outside this evaluation. Angular Aria's web directives do not replace the native interaction implementation.

## Validation and next step

Run `yarn build` before `yarn test`. The isolated suite covers twelve cases: tab relationships/classes/inertness, automatic selection with disabled skipping, manual activation, eager state persistence, projected-list injection failure, single expansion across wrapper boundaries, multi expansion, enabled/disabled menu actions, the standalone-group requirement, missing menu context, the public context bridge and the tab-typeahead gap.

The full regression suite passed: 133 web library tests, 48 showcase tests (including the twelve evaluation probes), 94 native unit tests, four builder tests, 72 standalone documentation examples and fourteen CSS configurations.

The production build passed and emitted no `ngTabs`, `ngAccordionGroup` or `ngMenuTrigger` directive markers in the application JavaScript. Existing initial-bundle, documentation-page SCSS and theme-builder SCSS budget warnings remain; this spike adds no production stylesheet.

Manual screen-reader and keyboard verification remain parked as requested. The dispatched-key unit probes test specific contracts, not actual browser/assistive-technology interoperability. Still unverified: real overlay integration of Aria menus, RTL/vertical/IME parity, dynamic item insertion/removal, SSR/hydration, reduced-motion transitions, nested overlays, rendered prefix/theme parity and bundle impact after runtime adoption.

The next implementation task should be a single Accordion/Collapse pilot preserving the public API, with focused regression tests and a review of the standalone/custom-trigger cases before moving on to Tabs or Dropdown. Do not replace all three families at once.
