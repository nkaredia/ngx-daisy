# Component catalog

Coverage of all 68 families in the [daisyUI 5.7.50 catalog](https://daisyui.com/components/), checked October 21, 2026. Icon and Form Field are additional ngx-daisy helpers. Each family has a standalone secondary entry point and its own lazy showcase page. Family coverage does not imply completion of the separate Angular Material catalog or the future documentation website. See the [parity audit](daisyui-parity-audit.md) for verified corrections and remaining visual/API gaps. Catalog presence is not a claim of visual equivalence.

All **70 showcase routes** include a full playground with live examples and authored TS/HTML/SCSS source tabs. Controls are extracted from the library during builds. Lists, Heroes, Browser Mockups and Window Mockups have no declared configurable inputs, so their properties panel explains that rather than inventing controls. Complex values use authored sample data and retain the unsupported-editor explanation. See the [playground guide](../projects/showcase/src/app/playground/README.md).

| Family             | Import                            | Showcase route       |
| ------------------ | --------------------------------- | -------------------- |
| Buttons            | `@ngx-daisy/cdk/button`           | `/buttons`           |
| Dropdowns          | `@ngx-daisy/cdk/dropdown`         | `/dropdowns`         |
| FAB / Speed Dial   | `@ngx-daisy/cdk/fab`              | `/fabs`              |
| Modals             | `@ngx-daisy/cdk/modal`            | `/modals`            |
| Swaps              | `@ngx-daisy/cdk/swap`             | `/swaps`             |
| Theme Controllers  | `@ngx-daisy/cdk/theme-controller` | `/theme-controllers` |
| Text Inputs        | `@ngx-daisy/cdk/input`            | `/inputs`            |
| Textareas          | `@ngx-daisy/cdk/textarea`         | `/textareas`         |
| Selects            | `@ngx-daisy/cdk/select`           | `/selects`           |
| Checkboxes         | `@ngx-daisy/cdk/checkbox`         | `/checkboxes`        |
| Toggles            | `@ngx-daisy/cdk/toggle`           | `/toggles`           |
| Range Sliders      | `@ngx-daisy/cdk/range`            | `/ranges`            |
| Radio Groups       | `@ngx-daisy/cdk/radio`            | `/radios`            |
| Filters            | `@ngx-daisy/cdk/filter`           | `/filters`           |
| Ratings            | `@ngx-daisy/cdk/rating`           | `/ratings`           |
| File Inputs        | `@ngx-daisy/cdk/file-input`       | `/file-inputs`       |
| OTP                | `@ngx-daisy/cdk/otp`              | `/otp`               |
| Calendars          | `@ngx-daisy/cdk/calendar`         | `/calendars`         |
| Fieldsets          | `@ngx-daisy/cdk/fieldset`         | `/fieldsets`         |
| Labels             | `@ngx-daisy/cdk/label`            | `/labels`            |
| Validators         | `@ngx-daisy/cdk/validator`        | `/validators`        |
| Drawer / Sidebar   | `@ngx-daisy/cdk/drawer`           | `/drawers`           |
| Loading (Loader)   | `@ngx-daisy/cdk/loader`           | `/loaders`           |
| Badges             | `@ngx-daisy/cdk/badge`            | `/badges`            |
| Avatars            | `@ngx-daisy/cdk/avatar`           | `/avatars`           |
| Auras              | `@ngx-daisy/cdk/aura`             | `/auras`             |
| Cards              | `@ngx-daisy/cdk/card`             | `/cards`             |
| Chat Bubbles       | `@ngx-daisy/cdk/chat`             | `/chat`              |
| Keyboard Shortcuts | `@ngx-daisy/cdk/kbd`              | `/keyboard`          |
| Lists              | `@ngx-daisy/cdk/list`             | `/lists`             |
| Stats              | `@ngx-daisy/cdk/stat`             | `/stats`             |
| Status Indicators  | `@ngx-daisy/cdk/status`           | `/statuses`          |
| Timelines          | `@ngx-daisy/cdk/timeline`         | `/timelines`         |
| Collapse           | `@ngx-daisy/cdk/collapse`         | `/collapses`         |
| Accordions         | `@ngx-daisy/cdk/accordion`        | `/accordions`        |
| Countdown          | `@ngx-daisy/cdk/countdown`        | `/countdowns`        |
| Carousels          | `@ngx-daisy/cdk/carousel`         | `/carousels`         |
| Diff               | `@ngx-daisy/cdk/diff`             | `/diffs`             |
| Hover 3D Cards     | `@ngx-daisy/cdk/hover-3d`         | `/hover-3d`          |
| Hover Galleries    | `@ngx-daisy/cdk/hover-gallery`    | `/hover-galleries`   |
| Text Rotate        | `@ngx-daisy/cdk/text-rotate`      | `/text-rotate`       |
| Tables             | `@ngx-daisy/cdk/table`            | `/tables`            |
| Breadcrumbs        | `@ngx-daisy/cdk/breadcrumbs`      | `/breadcrumbs`       |
| Docks              | `@ngx-daisy/cdk/dock`             | `/docks`             |
| Links              | `@ngx-daisy/cdk/link`             | `/links`             |
| Menus              | `@ngx-daisy/cdk/menu`             | `/menus`             |
| Navbars            | `@ngx-daisy/cdk/navbar`           | `/navbars`           |
| Pagination         | `@ngx-daisy/cdk/pagination`       | `/pagination`        |
| Steps              | `@ngx-daisy/cdk/steps`            | `/steps`             |
| Tabs               | `@ngx-daisy/cdk/tabs`             | `/tabs`              |
| Megamenus          | `@ngx-daisy/cdk/megamenu`         | `/megamenus`         |
| Alerts             | `@ngx-daisy/cdk/alert`            | `/alerts`            |
| Progress           | `@ngx-daisy/cdk/progress`         | `/progress`          |
| Radial Progress    | `@ngx-daisy/cdk/radial-progress`  | `/radial-progress`   |
| Skeletons          | `@ngx-daisy/cdk/skeleton`         | `/skeletons`         |
| Toasts             | `@ngx-daisy/cdk/toast`            | `/toasts`            |
| Tooltips           | `@ngx-daisy/cdk/tooltip`          | `/tooltips`          |
| Dividers           | `@ngx-daisy/cdk/divider`          | `/dividers`          |
| Footers            | `@ngx-daisy/cdk/footer`           | `/footers`           |
| Heroes             | `@ngx-daisy/cdk/hero`             | `/heroes`            |
| Indicators         | `@ngx-daisy/cdk/indicator`        | `/indicators`        |
| Join Groups        | `@ngx-daisy/cdk/join`             | `/joins`             |
| Masks              | `@ngx-daisy/cdk/mask`             | `/masks`             |
| Stacks             | `@ngx-daisy/cdk/stack`            | `/stacks`            |
| Browser Mockups    | `@ngx-daisy/cdk/mockup-browser`   | `/browser-mockups`   |
| Code Mockups       | `@ngx-daisy/cdk/mockup-code`      | `/code-mockups`      |
| Phone Mockups      | `@ngx-daisy/cdk/mockup-phone`     | `/phone-mockups`     |
| Window Mockups     | `@ngx-daisy/cdk/mockup-window`    | `/window-mockups`    |

Additional helpers: `@ngx-daisy/cdk/icon` at `/icons`, and `@ngx-daisy/cdk/form-field` at `/form-fields`.

## Guides

- [Actions](actions.md)
- [Data Input](data-inputs.md)
- [Data Display](data-display.md)
- [Navigation, feedback, layout and mockups](remaining-components.md)
- [Themes and customization](daisyui-customization.md)
