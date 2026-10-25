# Drawer

Compose a navigation panel or sidebar from `DsyDrawerContainer`, `DsyDrawerContent` and `DsyDrawer`. Use `over` for a modal panel above the viewport, or `side` for a persistent panel beside the content.

## Import and compose

Import the standalone components from the secondary entry point and add them to the consuming component's `imports`:

```ts
import { signal } from '@angular/core';
import { DsyDrawer, DsyDrawerContainer, DsyDrawerContent } from '@ngx-daisy/cdk/drawer';

// In the consuming component:
readonly opened = signal(false);
```

Place one drawer directly inside its container. Put the application's main content and controls inside `DsyDrawerContent`, and project navigation or other panel content into `DsyDrawer`:

```html
<dsy-drawer-container>
  <dsy-drawer-content>
    <button
      type="button"
      aria-controls="app-navigation"
      [attr.aria-expanded]="opened()"
      (click)="drawer.toggle()"
    >
      Open navigation
    </button>
    <main>
      <!-- Application content -->
    </main>
  </dsy-drawer-content>

  <dsy-drawer
    #drawer
    id="app-navigation"
    [(opened)]="opened"
    mode="over"
    position="start"
    width="18rem"
    aria-label="Application navigation"
  >
    <div class="p-4">
      <button type="button" (click)="drawer.close()">Close navigation</button>
      <nav aria-label="Main navigation">
        <!-- Application links -->
      </nav>
    </div>
  </dsy-drawer>
</dsy-drawer-container>
```

`opened` is a two-way model. Opening or closing through the component's methods, Escape or the backdrop updates the bound state.

## Modes and position

| Input           | Default      | Behavior                                                                |
| --------------- | ------------ | ----------------------------------------------------------------------- |
| `mode`          | `over`       | `over` is modal; `side` shares the container's layout with its content. |
| `position`      | `start`      | `start` or `end`, following the current text direction.                 |
| `width`         | `18rem`      | CSS width for the panel, such as `20rem` or `min(18rem, 80vw)`.         |
| `opened`        | `false`      | Two-way model controlling whether the drawer is open.                   |
| `disableClose`  | `false`      | Prevent Escape and backdrop dismissal in over mode.                     |
| `aria-label`    | `Navigation` | Give the modal panel a descriptive accessible name.                     |
| `panelClass`    | Empty        | App classes for the internal panel.                                     |
| `backdropClass` | Empty        | App classes for the backdrop.                                           |

In `over` mode, the panel and backdrop cover the viewport. Focus stays inside the panel, background interaction is made inert, and page scrolling is locked while it is open. Escape and clicking the backdrop close it unless `disableClose` is set. Closing restores focus to the opener when possible.

In `side` mode, the drawer remains in the container's layout and keeps the main content interactive. It does not create a modal backdrop or trap focus. Size the container to suit the content area.

`start` means the left edge in left-to-right layouts and the right edge in right-to-left layouts; `end` is the opposite. Prefer these logical positions for layouts that support both directions.

When switching an example or application between modes, close the panel before changing its layout. The showcase closes and resets the panel when mode or position changes, then lets the user reopen it.

## Methods

Use a template reference or a signal view query to call the drawer:

| Method            | Purpose                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| `open()`          | Open the panel.                                                                      |
| `close(options?)` | Close it. Pass `{ restoreFocus: false }` when another interaction will manage focus. |
| `toggle()`        | Switch between open and closed.                                                      |

An explicit close button remains available even with `disableClose`. For example:

```html
<dsy-drawer #drawer disableClose aria-label="Required settings">
  <button type="button" (click)="drawer.close()">Close settings</button>
  <!-- Settings content -->
</dsy-drawer>
```

Include that drawer inside its container. When a navigation action moves focus to a new page, `drawer.close({ restoreFocus: false })` allows that page's focus handling to take over.

## Styling

The panel uses the active daisyUI theme's `base-200` background and content color. Project the desired spacing, navigation markup, controls and optional icons. The component supplies no default icons.

Use `width` for the panel width. The following CSS custom properties control motion and stacking:

| Custom property         | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `--dsy-drawer-width`    | Panel width; defaults to `18rem` unless an input or app style supplies it. |
| `--dsy-drawer-duration` | Duration of the panel transition.                                          |
| `--dsy-drawer-z-index`  | Stacking level of the modal drawer and backdrop.                           |

```html
<dsy-drawer
  aria-label="Application navigation"
  width="20rem"
  style="--dsy-drawer-duration: 180ms; --dsy-drawer-z-index: 60"
>
  <!-- Panel content -->
</dsy-drawer>
```

The component disables motion when reduced motion is preferred.

`panelClass` and `backdropClass` apply app classes to the internal panel and backdrop. For example, `panelClass="bg-primary text-primary-content rounded-box p-6"` or `backdropClass="bg-black/60"`. Use the configured prefix spelling for those classes; `@ngx-daisy/cdk` does not rewrite app-supplied strings. Host classes, global styles and the custom properties above are also available. See [daisyUI customization](../../../docs/daisyui-customization.md) for prefixes and state styling variants.

Over-mode widths are capped at `calc(100vw - 3rem)` to keep a backdrop dismissal area visible. `--dsy-drawer-backdrop` overrides the default translucent black backdrop.

## Accessibility and layout

Give every drawer a descriptive accessible name and provide a visible close button in its projected content. Connect opening controls with `aria-controls` and reflect the `opened` state through `aria-expanded`. Use ordinary navigation, headings and controls inside the panel.

Keep page interaction inside `DsyDrawerContent` so the drawer can coordinate background interaction in modal mode. Each container supports one directly nested drawer. The container/content/panel composition is required; an isolated drawer is not a complete layout.

The component supplies CDK scroll-lock styles and supports `cdkFocusInitial` on projected controls. Place viewport drawers outside ancestors with transforms, filters or containment that change the containing block for fixed positioning. Existing CDK overlay containers remain available for menus and dialogs opened from the panel.

The showcase at `/drawers` demonstrates a persistent side panel and a viewport modal, with logical position controls and explicit open/close actions.
