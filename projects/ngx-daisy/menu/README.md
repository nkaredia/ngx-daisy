# @ngx-daisy/cdk/menu

Standalone Angular menus with daisyUI appearance. See the [component guide](../../../docs/remaining-components.md) for imports, APIs, examples and behavior. Showcase: `/menus`.

For a class-controlled dropdown, bind the same boolean to `[opened]` on `dsyMenuDropdownToggle` and `dsyMenuDropdown`. The directives map it to the prefixed native `menu-dropdown-show` class, trigger aria-expanded and panel inertness. The app owns the click handler and aria-controls/ID connection. Native `details[dsyMenuSubmenu]` remains available for automatic disclosure behavior.

The opened inputs are optional: when omitted, existing manually applied native classes/details markup continue to own visibility and the directives do not add expanded/inert state.
