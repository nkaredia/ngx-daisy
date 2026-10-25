# Icon

`DsyIcon` wraps projected icon content and supplies consistent size, daisyUI color and accessibility. Use your preferred Angular icon component, font markup or inline SVG inside it.

The app owns its icon packages, imports, registration and tree shaking. ngx-daisy does not install a default icon library or resolve icon names. Use the selected provider's documented Angular integration and compatible package versions.

## Lucide (showcase default)

Install `@lucide/angular` in your app and import only the icons you use:

```ts
import { Component } from '@angular/core';
import { LucideHouse } from '@lucide/angular';
import { DsyIcon } from 'ngx-daisy/icon';

@Component({
  selector: 'app-home-icon',
  imports: [DsyIcon, LucideHouse],
  template: `<dsy-icon color="primary" size="1.5rem" aria-label="Home"
    ><svg lucideHouse aria-hidden="true"></svg
  ></dsy-icon>`,
})
export class HomeIcon {}
```

The showcase uses Lucide by default. The library does not install or register an icon provider for consumers. See the [official Angular guide](https://lucide.dev/guide/angular/getting-started).

## Font Awesome

Install the renderer and the icon packs your app needs:

```sh
yarn add @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

Import the icon wrapper, the renderer and individual icon definitions:

```ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { DsyIcon } from 'ngx-daisy/icon';

@Component({
  selector: 'app-home-link',
  imports: [DsyIcon, FaIconComponent],
  template: `
    <dsy-icon size="24px" color="primary" aria-label="Home">
      <fa-icon [icon]="house" aria-hidden="true" />
    </dsy-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HomeLink {
  protected readonly house = faHouse;
}
```

Individual Font Awesome imports support tree shaking. Importing and registering a whole pack includes that pack. Font Awesome remains supported as projected content; it is not a consumer dependency of ngx-daisy. See [Font Awesome's Angular integration](https://github.com/FortAwesome/angular-fontawesome) and [tree-shaking documentation](https://docs.fontawesome.com/apis/javascript/tree-shaking/).

## Ng Icons

Ng Icons provides one Angular API for many collections. Install its core and the chosen collection, for example:

```sh
yarn add @ng-icons/core @ng-icons/heroicons
```

Register selected imports through the provider's API:

```ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { DsyIcon } from 'ngx-daisy/icon';

@Component({
  selector: 'app-users-link',
  imports: [DsyIcon, NgIcon],
  providers: [provideIcons({ heroUsers })],
  template: `
    <dsy-icon size="1.5rem" color="secondary" aria-label="Users">
      <ng-icon name="heroUsers" aria-hidden="true" />
    </dsy-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UsersLink {}
```

Ng Icons supports individual icon exports and tree shaking. Its own `name` input and registration belong to Ng Icons; the wrapper simply projects the component. See [Ng Icons' documentation](https://ng-icons.github.io/ng-icons/) for supported collections and registration options.

## Inline SVG

A provider package is optional. Project a custom SVG directly:

```html
<dsy-icon size="24px" color="success" aria-label="Status">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
  </svg>
</dsy-icon>
```

Use `currentColor` for the SVG's fill or stroke so it inherits the wrapper's color.

## Inputs and styling

| Input        | Default   | Purpose                                                                |
| ------------ | --------- | ---------------------------------------------------------------------- |
| `size`       | `1em`     | CSS size, such as `24px` or `1.5rem`.                                  |
| `color`      | `inherit` | Inherit text color or select one of the semantic daisyUI colors below. |
| `aria-label` | Omitted   | Describe a meaningful standalone icon.                                 |

Semantic colors are `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning` and `error`. They use the active daisyUI theme. The default inherits text color from the surrounding element.

For an arbitrary CSS color, set the wrapper's `--dsy-icon-color` custom property:

```html
<dsy-icon size="2rem" style="--dsy-icon-color: #7c3aed" aria-label="Home">
  <fa-icon [icon]="house" aria-hidden="true" />
</dsy-icon>
```

The wrapper's SCSS scopes its visual styling to `dsy-icon` and its projected content. Projected SVGs and font icons should inherit size and `currentColor`. Provider markup can affect the result: styles cannot reach inside a provider's Shadow DOM, and a provider's explicit inline size or color can override inherited values. Adjust that provider's inputs or styles when needed. The wrapper preserves the icon artwork's fill and stroke choices.

The `size` input sets `--dsy-icon-size`; app `text-*` utilities can override the wrapper's font size. All visual defaults are layered so app utilities and global styles can customize the wrapper or projected markup. See [daisyUI customization](../../../docs/daisyui-customization.md) for configuration and prefixes.

## Accessibility

Without `aria-label`, the wrapper is decorative and hidden from assistive technology. When an icon communicates meaning on its own, give the wrapper an `aria-label`; it uses `role="img"`.

Keep projected content noninteractive. Hide the provider's own icon from assistive technology to avoid duplicate announcements. If a button or link already supplies the accessible name, leave the icon wrapper decorative:

```html
<button dsyButton type="button" aria-label="Go home">
  <dsy-icon>
    <fa-icon [icon]="house" aria-hidden="true" />
  </dsy-icon>
</button>
```

Assets, font loading, licenses and asynchronous loading behavior remain under the app's control.
