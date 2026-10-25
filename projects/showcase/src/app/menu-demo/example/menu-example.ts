import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  linkedSignal,
} from '@angular/core';
import {
  DsyMenu,
  DsyMenuItem,
  DsyMenuSubmenu,
  DsyMenuDropdown,
  DsyMenuDropdownToggle,
  DsyMenuTitle,
} from 'ngx-daisy/menu';

interface MenuValues {
  readonly size?: ReturnType<DsyMenu['size']>;
  readonly orientation?: ReturnType<DsyMenu['orientation']>;
  readonly paged?: ReturnType<DsyMenu['paged']>;
}

interface MenuItemValues {
  readonly disabled?: ReturnType<DsyMenuItem['disabled']>;
  readonly active?: ReturnType<DsyMenuItem['active']>;
  readonly focused?: ReturnType<DsyMenuItem['focused']>;
}

interface MenuSubmenuValues {
  readonly opened?: ReturnType<DsyMenuSubmenu['opened']>;
}

interface MenuDropdownValues {
  readonly opened?: ReturnType<DsyMenuDropdown['opened']>;
}

interface MenuDropdownToggleValues {
  readonly opened?: ReturnType<DsyMenuDropdownToggle['opened']>;
}

@Component({
  selector: 'demo-menu-example',
  standalone: true,
  imports: [
    DsyMenu,
    DsyMenuItem,
    DsyMenuSubmenu,
    DsyMenuDropdown,
    DsyMenuDropdownToggle,
    DsyMenuTitle,
  ],
  templateUrl: './menu-example.html',
  styleUrl: './menu-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MenuExample {
  readonly values = input<
    readonly [
      MenuValues?,
      MenuItemValues?,
      MenuSubmenuValues?,
      MenuDropdownValues?,
      MenuDropdownToggleValues?,
      Record<string, never>?,
    ]
  >([]);
  readonly props = computed<MenuValues>(() => this.values()[0] ?? {});
  readonly item = computed<MenuItemValues>(() => this.values()[1] ?? {});
  readonly submenu = computed<MenuSubmenuValues>(() => this.values()[2] ?? {});
  readonly dropdown = computed<MenuDropdownValues>(() => this.values()[3] ?? {});
  readonly dropdownToggle = computed<MenuDropdownToggleValues>(() => this.values()[4] ?? {});
  readonly configuredSubmenuOpened = computed(() => this.submenu().opened ?? false);
  readonly submenuOpened = linkedSignal(() => this.configuredSubmenuOpened());
  readonly configuredDropdownOpened = computed(() => this.dropdown().opened);
  readonly configuredToggleOpened = computed(() => this.dropdownToggle().opened);
  // Both directives describe one disclosure. The most recently edited control wins.
  readonly dropdownOpened = linkedSignal<
    { content: boolean | undefined; toggle: boolean | undefined },
    boolean
  >({
    source: () => ({
      content: this.configuredDropdownOpened(),
      toggle: this.configuredToggleOpened(),
    }),
    computation: (source, previous) => {
      if (!previous || source.content !== previous.source.content) return source.content ?? false;
      if (source.toggle !== previous.source.toggle) return source.toggle ?? false;
      return previous.value;
    },
  });
  readonly toggle = (opened: boolean) => !opened;
}
