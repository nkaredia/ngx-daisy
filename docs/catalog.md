# Component catalog

Coverage of all 68 families in the [daisyUI 5.7.50 catalog](https://daisyui.com/components/), checked October 21, 2026. Icon and Form Field are additional ngx-daisy helpers. Each family has a standalone secondary entry point and its own lazy showcase page. Family coverage does not imply completion of the separate Angular Material catalog or the future documentation website. See the [parity audit](daisyui-parity-audit.md) for verified corrections and remaining visual/API gaps. Catalog presence is not a claim of visual equivalence.

All **70 showcase routes** include a full playground with live examples and authored TS/HTML/SCSS source tabs. Controls are extracted from the library during builds. Lists, Heroes, Browser Mockups and Window Mockups have no declared configurable inputs, so their properties panel explains that rather than inventing controls. Complex values use authored sample data and retain the unsupported-editor explanation. See the [playground guide](../projects/showcase/src/app/playground/README.md).

| Family             | Import                       | Showcase route       |
| ------------------ | ---------------------------- | -------------------- |
| Buttons            | `ngx-daisy/button`           | `/buttons`           |
| Dropdowns          | `ngx-daisy/dropdown`         | `/dropdowns`         |
| FAB / Speed Dial   | `ngx-daisy/fab`              | `/fabs`              |
| Modals             | `ngx-daisy/modal`            | `/modals`            |
| Swaps              | `ngx-daisy/swap`             | `/swaps`             |
| Theme Controllers  | `ngx-daisy/theme-controller` | `/theme-controllers` |
| Text Inputs        | `ngx-daisy/input`            | `/inputs`            |
| Textareas          | `ngx-daisy/textarea`         | `/textareas`         |
| Selects            | `ngx-daisy/select`           | `/selects`           |
| Checkboxes         | `ngx-daisy/checkbox`         | `/checkboxes`        |
| Toggles            | `ngx-daisy/toggle`           | `/toggles`           |
| Range Sliders      | `ngx-daisy/range`            | `/ranges`            |
| Radio Groups       | `ngx-daisy/radio`            | `/radios`            |
| Filters            | `ngx-daisy/filter`           | `/filters`           |
| Ratings            | `ngx-daisy/rating`           | `/ratings`           |
| File Inputs        | `ngx-daisy/file-input`       | `/file-inputs`       |
| OTP                | `ngx-daisy/otp`              | `/otp`               |
| Calendars          | `ngx-daisy/calendar`         | `/calendars`         |
| Fieldsets          | `ngx-daisy/fieldset`         | `/fieldsets`         |
| Labels             | `ngx-daisy/label`            | `/labels`            |
| Validators         | `ngx-daisy/validator`        | `/validators`        |
| Drawer / Sidebar   | `ngx-daisy/drawer`           | `/drawers`           |
| Loading (Loader)   | `ngx-daisy/loader`           | `/loaders`           |
| Badges             | `ngx-daisy/badge`            | `/badges`            |
| Avatars            | `ngx-daisy/avatar`           | `/avatars`           |
| Auras              | `ngx-daisy/aura`             | `/auras`             |
| Cards              | `ngx-daisy/card`             | `/cards`             |
| Chat Bubbles       | `ngx-daisy/chat`             | `/chat`              |
| Keyboard Shortcuts | `ngx-daisy/kbd`              | `/keyboard`          |
| Lists              | `ngx-daisy/list`             | `/lists`             |
| Stats              | `ngx-daisy/stat`             | `/stats`             |
| Status Indicators  | `ngx-daisy/status`           | `/statuses`          |
| Timelines          | `ngx-daisy/timeline`         | `/timelines`         |
| Collapse           | `ngx-daisy/collapse`         | `/collapses`         |
| Accordions         | `ngx-daisy/accordion`        | `/accordions`        |
| Countdown          | `ngx-daisy/countdown`        | `/countdowns`        |
| Carousels          | `ngx-daisy/carousel`         | `/carousels`         |
| Diff               | `ngx-daisy/diff`             | `/diffs`             |
| Hover 3D Cards     | `ngx-daisy/hover-3d`         | `/hover-3d`          |
| Hover Galleries    | `ngx-daisy/hover-gallery`    | `/hover-galleries`   |
| Text Rotate        | `ngx-daisy/text-rotate`      | `/text-rotate`       |
| Tables             | `ngx-daisy/table`            | `/tables`            |
| Breadcrumbs        | `ngx-daisy/breadcrumbs`      | `/breadcrumbs`       |
| Docks              | `ngx-daisy/dock`             | `/docks`             |
| Links              | `ngx-daisy/link`             | `/links`             |
| Menus              | `ngx-daisy/menu`             | `/menus`             |
| Navbars            | `ngx-daisy/navbar`           | `/navbars`           |
| Pagination         | `ngx-daisy/pagination`       | `/pagination`        |
| Steps              | `ngx-daisy/steps`            | `/steps`             |
| Tabs               | `ngx-daisy/tabs`             | `/tabs`              |
| Megamenus          | `ngx-daisy/megamenu`         | `/megamenus`         |
| Alerts             | `ngx-daisy/alert`            | `/alerts`            |
| Progress           | `ngx-daisy/progress`         | `/progress`          |
| Radial Progress    | `ngx-daisy/radial-progress`  | `/radial-progress`   |
| Skeletons          | `ngx-daisy/skeleton`         | `/skeletons`         |
| Toasts             | `ngx-daisy/toast`            | `/toasts`            |
| Tooltips           | `ngx-daisy/tooltip`          | `/tooltips`          |
| Dividers           | `ngx-daisy/divider`          | `/dividers`          |
| Footers            | `ngx-daisy/footer`           | `/footers`           |
| Heroes             | `ngx-daisy/hero`             | `/heroes`            |
| Indicators         | `ngx-daisy/indicator`        | `/indicators`        |
| Join Groups        | `ngx-daisy/join`             | `/joins`             |
| Masks              | `ngx-daisy/mask`             | `/masks`             |
| Stacks             | `ngx-daisy/stack`            | `/stacks`            |
| Browser Mockups    | `ngx-daisy/mockup-browser`   | `/browser-mockups`   |
| Code Mockups       | `ngx-daisy/mockup-code`      | `/code-mockups`      |
| Phone Mockups      | `ngx-daisy/mockup-phone`     | `/phone-mockups`     |
| Window Mockups     | `ngx-daisy/mockup-window`    | `/window-mockups`    |

Additional helpers: `ngx-daisy/icon` at `/icons`, and `ngx-daisy/form-field` at `/form-fields`.

## Guides

- [Actions](actions.md)
- [Data Input](data-inputs.md)
- [Data Display](data-display.md)
- [Navigation, feedback, layout and mockups](remaining-components.md)
- [Themes and customization](daisyui-customization.md)
