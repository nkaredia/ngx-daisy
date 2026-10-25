# Actions

All six [daisyUI Actions families](https://daisyui.com/components/) are available as tree-shakable secondary entry points. Apps compile daisyUI and Tailwind; see [configuration](daisyui-customization.md). Every family has a dedicated showcase route.

| Family           | Import                            | Showcase             |
| ---------------- | --------------------------------- | -------------------- |
| Button           | `@ngx-daisy/cdk/button`           | `/buttons`           |
| Dropdown         | `@ngx-daisy/cdk/dropdown`         | `/dropdowns`         |
| FAB / Speed Dial | `@ngx-daisy/cdk/fab`              | `/fabs`              |
| Modal            | `@ngx-daisy/cdk/modal`            | `/modals`            |
| Swap             | `@ngx-daisy/cdk/swap`             | `/swaps`             |
| Theme Controller | `@ngx-daisy/cdk/theme-controller` | `/theme-controllers` |

## Button

Import `DsyButton`. Apply to a native button or anchor, keeping native forms, links and router links.

```html
<button dsyButton color="primary" [loading]="saving()">Save</button>
<a dsyButton href="/projects" variant="outline">Projects</a>
```

| Input                           | Values / default                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `color`                         | neutral, primary, secondary, accent, info, success, warning, error; omitted uses daisyUI default |
| `size`                          | xs, sm, md, lg, xl; omitted allows native/responsive size classes                                |
| `variant`                       | solid (default), outline, soft, ghost, link, dash                                                |
| `shape`                         | normal (default), square, circle                                                                 |
| `layout`                        | auto (default), wide, block                                                                      |
| `disabled`, `loading`, `active` | boolean, false                                                                                   |
| `type`                          | button (default), submit, reset; native buttons only                                             |
| `tabindex`                      | optional native tab index, restored after a disabled anchor is enabled                           |

Loading adds a decorative spinner, busy state and disables activation. Keep meaningful button text. Disabled anchors retain their destination but leave the tab order and block click/auxiliary activation, including consumer Angular listeners. Icon-only buttons need an accessible name. Native button content must not contain other interactive elements.

## Dropdown

Import `DsyDropdown`, `DsyDropdownTrigger`, `DsyDropdownContent`, `DsyDropdownItem`.

```html
<dsy-dropdown aria-label="Project actions">
  <button dsyButton dsyDropdownTrigger>Actions</button>
  <ng-template dsyDropdownContent>
    <button dsyDropdownItem (triggered)="edit()">Edit</button>
    <a dsyDropdownItem href="/projects">Projects</a>
    <button dsyDropdownItem disabled>Unavailable</button>
  </ng-template>
</dsy-dropdown>
```

Use exactly one native button trigger and one content template. The default `kind="menu"` supplies menu/menuitem semantics, CDK focus navigation (Up/Down, Home/End, typeahead), disabled-item skipping and Enter/Space activation. Escape, Tab, selection, outside pointer or outside focus close it; Escape/selection restore trigger focus. Use `triggered` for item actions. Content is created on open and destroyed on close; keep persistent state in the app. Nested submenu composition is not exposed by this family.

Use `kind="content"` for cards, forms and arbitrary projected content. It uses nonmodal dialog semantics and native Tab order; do not apply `dsyDropdownItem` in content mode. Escape closes it, while prevented Escape events from child widgets are respected. Set an appropriate `aria-label`.

| API                                              | Values / default                                           |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `opened`                                         | two-way model, false                                       |
| `placement`                                      | bottom (default), top, left, right (physical sides)        |
| `align`                                          | start (default), center, end; start/end follow direction   |
| `hover`                                          | false; hover keeps click/keyboard access                   |
| `disabled`                                       | false; prevents opening and closes an open dropdown        |
| `autoFocus`                                      | true                                                       |
| `panelClass`                                     | application classes on portalled panel                     |
| `id`, `aria-label`                               | generated ID, Options label                                |
| `open(focus)`, `close(restoreFocus)`, `toggle()` | focus first/last/false; close restores by default          |
| Item `disabled`, `label`, `triggered`            | disabled state, optional typeahead text, activation output |

The CDK overlay flips or pushes to fit the viewport. Its external wrapper copies inherited CSS custom properties, typography, color scheme and direction from the source after Angular rendering. `panelClass` can override inherited defaults. Ancestor descendant selectors, container queries and attributes are not copied across the portal: target the panel with a global class. Theme changes outside Angular rendering require an Angular render to refresh the copied values. Overlays opened from a modal remain accessible through the shared CDK overlay container.

## FAB / Speed Dial

Import `DsyFab`, `DsyFabTrigger`, `DsyFabAction`, and optionally `DsyFabClose` or `DsyFabMainAction`. Add `DsyButton` for daisyUI button appearances.

```html
<dsy-fab aria-label="Create content">
  <button dsyButton dsyFabTrigger shape="circle" color="primary" aria-label="Create">+</button>
  <button dsyButton dsyFabClose shape="circle" aria-label="Close actions">×</button>
  <button dsyButton dsyFabAction (triggered)="createDocument()">Document</button>
  <button dsyButton dsyFabAction (triggered)="createFolder()">Folder</button>
</dsy-fab>
```

| API                                              | Values / default                                             |
| ------------------------------------------------ | ------------------------------------------------------------ |
| `opened`                                         | two-way model, false                                         |
| `layout`                                         | vertical (default), flower                                   |
| `position`                                       | fixed (default), absolute, inline                            |
| `corner`                                         | end (default), start; logical direction                      |
| `radius`                                         | optional CSS flower radius, default 9rem                     |
| `openOnFocus`                                    | false                                                        |
| `id`, `aria-label`                               | generated actions ID, Quick actions                          |
| `open(focus)`, `close(restoreFocus)`, `toggle()` | optional first/last focus; close does not restore by default |
| Action `disabled`, `triggered`                   | native button/anchor disabled state and activation output    |

Use one trigger. A trigger alone is a single FAB; attach the app click handler to it. A speed dial may have one replacement main action OR close control. Flower layout supports up to four regular actions. Buttons/anchors remain ordinary actions, rather than menu items. Arrow keys, Home/End and typeahead use CDK focus navigation. Escape restores the trigger; outside pointer/focus closes without stealing focus. Hidden actions are inert. Actions automatically close the dial; use `triggered` for app actions. A main action is activated with `triggered`; a close control only dismisses. An absolute FAB needs a positioned ancestor.

Styling hooks: projected buttons/labels and `--dsy-fab-radius`, `--dsy-fab-gap`, `--dsy-fab-duration`, `--dsy-fab-z-index`. Add daisyUI tooltip classes to projected buttons when needed, with accessible button labels.

## Modal

Import `DsyModal`, `DsyModalTitle`, `DsyModalContent`, `DsyModalActions`, `DsyModalClose`.

```html
<button dsyButton (click)="dialog.open()">Open</button>
<dsy-modal #dialog aria-labelledby="dialog-title" (closed)="onResult($event)">
  <h3 dsyModalTitle id="dialog-title">Create project</h3>
  <div dsyModalContent>Project details</div>
  <div dsyModalActions>
    <button dsyButton dsyModalClose="cancel">Cancel</button>
    <button dsyButton color="primary" dsyModalClose="create">Create</button>
  </div>
</dsy-modal>
```

| API                                                     | Values / default                                               |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| `opened`                                                | two-way model, false                                           |
| `placement`                                             | middle (default), top, bottom, start, end                      |
| `disableClose`                                          | false; blocks backdrop/Escape, permits explicit close          |
| `role`                                                  | dialog (default), alertdialog                                  |
| `aria-label`                                            | Dialog default; prefer `aria-labelledby` referencing a title   |
| `aria-labelledby`, `aria-describedby`                   | optional IDs on the actual panel                               |
| `width`                                                 | optional CSS width; default panel width is utility-overridable |
| `panelClass`, `backdropClass`                           | styling hooks for internal visual slots                        |
| `open()`, `toggle()`, `close(result?, {restoreFocus?})` | explicit state methods; restoreFocus defaults true             |
| `closed`                                                | emits result after an opened dialog closes                     |
| `dsyModalClose`                                         | optional result on a native button                             |

The Angular state API replaces checkbox/URL/native-dialog opening tricks. The panel stays in its projected theme scope, uses a CDK focus trap, inerts background siblings and locks document scrolling. Drawers and modals share one stack: only the top modal dismisses on Escape, and nested closure retains the parent lock and restores its opener. Closed panels are inert and hidden from accessibility. Place `cdkFocusInitial` on the preferred initial control, or the first focusable control/panel receives focus. Keep modal hosts outside ancestors with transforms, filters or containment that turn viewport fixed positioning into ancestor-relative positioning. Unlike a native `<dialog>` top layer, this surface participates in CSS stacking contexts. Projected content stays mounted when closed.

Theme and utility styling works on host/panel/backdrop; tokens include `--radius-box`, `--color-base-100`, `--color-base-content`, `--dsy-modal-duration`, `--dsy-modal-z-index`.

## Swap

Import `DsySwap` and optionally Angular `FormsModule` or `ReactiveFormsModule`.

```html
<dsy-swap [(checked)]="enabled" animation="rotate" aria-label="Enable sound">
  <span dsySwapOff>Sound off</span>
  <span dsySwapOn>Sound on</span>
  <span dsySwapIndeterminate>Some enabled</span>
</dsy-swap>
```

The three static marker attributes are projection slots; they need no directive imports. `checked` and `indeterminate` are boolean models (bind `[indeterminate]="true"`, not a bare attribute). `animation` is none (default), rotate or flip. `disabled` defaults false. `color`, `size`, `variant` (ghost default) mirror buttons; `buttonClass` styles the internal native button.

The button uses `aria-pressed`, with mixed state when indeterminate. Inactive slots are inert and hidden from accessibility; projected icons should be decorative and noninteractive. Clicking clears indeterminate, toggles checked and updates the model/forms. A ControlValueAccessor supports ngModel/formControl, touched and disabled states. Use either the checked model or forms as the value owner. Native Space/Enter activation is retained. Supply a stable accessible name through `aria-label`.

## Theme Controller

Import `DsyThemeController`; apply `[dsyThemeController]="themeName"` to a native checkbox/radio. The directive adds the native class and synchronizes both value property and attribute for daisyUI CSS. It does not install, register, validate against a fixed list or persist themes.

```html
<input type="checkbox" dsyThemeController="dark" class="toggle" aria-label="Dark theme" />
<label><input type="radio" name="theme" dsyThemeController="light" checked /> Light</label>
<label><input type="radio" name="theme" dsyThemeController="custom-brand" /> Brand</label>
```

Enable the named themes in app CSS. Native checked/disabled/name behavior and Angular built-in forms accessors remain available. `changed` emits `{theme, checked}`. Radio groups should share a name. A checked controller changes daisyUI's configured root through CSS `:has`; an explicit nested `data-theme` keeps its own theme. For scoped roots place the controller inside that scope. Apps may use `changed` to update a scoped `data-theme`, storage or other app state. Multiple checked controllers targeting the same root follow daisyUI CSS cascade rules, so coordinate them in the app.

DaisyUI deliberately exempts `theme-controller` from Tailwind's namespace. With daisyUI prefix `d-` and Tailwind prefix `tw`, the controller uses `d-theme-controller`, while buttons use `tw:d-btn` and compatibility aliases. All other family classes go through the shared class renderer.

## Motion and customization

All custom animations/transitions respect reduced motion. Native daisyUI visuals remain controlled by its emitted stylesheet. Applications can use all built-in/custom themes, scoped roots, include/exclude and prefixes. Excluding native CSS intentionally removes that native appearance; Angular accessibility/interaction/layout safeguards remain. Utility classes can customize visual slots, but apps should retain disabled, hidden and inert safeguards. See the configuration guide for the build matrix.
