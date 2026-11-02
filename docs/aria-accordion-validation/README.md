# Accordion/Collapse Angular Aria migration

This is the first implementation stage from the adoption evaluation. Enabled built-in title and button-only triggers use Angular Aria's accordion trigger, panel and content directives. CDK remains the expansion coordinator for single/multiple groups, public group commands and caller-owned legacy trigger templates. Tabs and Dropdown are unchanged.

The accordion group stays on the existing host, preserving direct projected children and application layout utilities. A standalone native disclosure places its local Aria group on its existing heading. The public `ACCORDION_GROUP` token bridges the wrapper's logical view boundary; no underscored Aria pattern APIs are used. Native-disabled triggers are excluded from the enabled interaction list and retain native disabled semantics and programmatic state changes. Custom trigger templates retain their existing API and behavior.

No styling overrides, palette changes or sizing changes were introduced. Default native markup relationships remain compatible with daisyUI direct-child selectors. Original focus restoration, immediate inertness and delayed visual removal remain in place. Native trigger/panel views are recreated together when the trigger mode or native/custom/disabled branch changes, while projected draft state is preserved.

## Verification

- Final `yarn build` passed with the existing initial bundle, documentation-page SCSS and theme-builder SCSS warnings.
- Final full `yarn test` passed: 141 web library tests, 48 showcase tests, 94 native unit tests, four builder tests, 72 documentation examples and fourteen CSS configurations.
- Eight added regressions cover group-boundary injection and disabled skipping, standalone draft persistence, independent header actions, custom-template coordination and group commands, stale close events, editing-key isolation, trigger-mode changes and disabled programmatic state changes.
- After adding native direct-child assertions to the standalone regression, all 141 library tests passed again. The assertions require the content panel and heading to remain direct children of `dsy-collapse`, preventing the intermediate wrapper regression.
- Earlier browser checks exercised exclusive selection, Open all/Close all, standalone toggling, disabled controls and the legacy playground code trigger. They found no runtime warning/error messages. Desktop/mobile checks on Accordions, Collapse and Buttons found no overflow or missing region labels.

The earlier browser screenshot revealed that an intermediate standalone wrapper broke daisyUI's direct-child visibility selectors. The wrapper was removed in favor of the heading-level group, and all final automated checks pass. **The final visual recheck is complete.** After the browser connection recovered, the open content and button-only content were confirmed visible, with their panels remaining direct children of the native collapse host. The native disabled control remained inactive, the custom code toggle worked, and no mobile overflow was found. `final-collapse.jpg` captures the verified view. The preview server remains on port 4401.

Manual screen-reader and comprehensive keyboard verification remain deferred. No new compliance certification is claimed.
