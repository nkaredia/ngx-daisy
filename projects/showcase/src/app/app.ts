import {
  LucideDynamicIcon,
  LucideMenu,
  LucideMoon,
  LucidePaintbrush,
  LucideSun,
  LucideX,
  LucideChevronDown,
  LucideCheck,
} from '@lucide/angular';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DsyIcon } from '@ngx-daisy/cdk/icon';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyDrawer, DsyDrawerContainer, DsyDrawerContent } from '@ngx-daisy/cdk/drawer';
import { showcaseGroups } from './showcase-pages';
import libraryPackage from '../../../ngx-daisy/package.json';
import { NgStyle } from '@angular/common';
import { ThemeStore } from './theme-builder/theme-store';
import {
  daisyThemes,
  displayThemeName,
  type DaisyThemeName,
} from './theme-builder/showcase-themes';
import { DsyToggle } from '@ngx-daisy/cdk/toggle';
import { DsyTooltip } from '@ngx-daisy/cdk/tooltip';
import {
  DsyDropdown,
  DsyDropdownContent,
  DsyDropdownItem,
  DsyDropdownTrigger,
} from '@ngx-daisy/cdk/dropdown';

@Component({
  selector: 'demo-root',
  imports: [
    NgStyle,
    LucideDynamicIcon,
    LucideMenu,
    LucideMoon,
    LucidePaintbrush,
    LucideSun,
    LucideX,
    LucideChevronDown,
    LucideCheck,
    DsyIcon,
    DsyButton,
    DsyToggle,
    DsyTooltip,
    DsyDropdown,
    DsyDropdownContent,
    DsyDropdownItem,
    DsyDropdownTrigger,
    DsyDrawer,
    DsyDrawerContainer,
    DsyDrawerContent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss', './app-sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class App {
  readonly customThemes = inject(ThemeStore);
  readonly daisyThemes = daisyThemes.filter((theme) => theme !== 'light' && theme !== 'dark');
  readonly displayThemeName = displayThemeName;
  readonly theme = signal<DaisyThemeName>('light');
  readonly themeSelection = computed(() =>
    this.customThemes.active()
      ? `custom:${this.customThemes.active()!.name}`
      : `daisy:${this.theme()}`,
  );
  readonly groups = showcaseGroups;
  readonly version = libraryPackage.version;
  private readonly router = inject(Router);
  readonly themeBuilderPage = signal(this.router.url.split(/[?#]/)[0] === '/themes');
  private readonly breakpoints = inject(BreakpointObserver);
  readonly desktop = signal(this.breakpoints.isMatched('(min-width: 1024px)'));
  readonly persistentNavigation = computed(() => this.desktop() && !this.themeBuilderPage());
  readonly navigationOpened = signal(this.persistentNavigation());
  private readonly navigation = viewChild<DsyDrawer>('navigationDrawer');
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('showcaseContent');

  constructor() {
    const injector = inject(Injector);
    afterNextRender(
      () => {
        try {
          const theme = localStorage.getItem('ngx-daisy.showcase-theme');
          if (theme && daisyThemes.includes(theme as DaisyThemeName))
            this.theme.set(theme as DaisyThemeName);
        } catch {
          // Theme selection remains available when browser storage is unavailable.
        }
      },
      { injector },
    );
    this.breakpoints
      .observe('(min-width: 1024px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        this.desktop.set(matches);
        this.navigationOpened.set(this.persistentNavigation());
      });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const wasThemeBuilder = this.themeBuilderPage();
        this.themeBuilderPage.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/themes');
        if (!this.persistentNavigation()) this.navigation()?.close({ restoreFocus: false });
        else if (wasThemeBuilder) this.navigationOpened.set(true);
        afterNextRender(() => this.content().nativeElement.focus({ preventScroll: true }), {
          injector,
        });
      });
  }

  setColorMode(dark: boolean) {
    this.selectTheme(`daisy:${dark ? 'dark' : 'light'}`);
  }

  selectTheme(value: string) {
    if (value.startsWith('custom:')) {
      this.customThemes.activate(value.slice('custom:'.length));
      return;
    }
    const theme = value.slice('daisy:'.length);
    if (!daisyThemes.includes(theme as DaisyThemeName)) return;
    this.customThemes.apply(null);
    this.theme.set(theme as DaisyThemeName);
    try {
      localStorage.setItem('ngx-daisy.showcase-theme', theme);
    } catch {
      // Theme selection remains available for this session when storage is unavailable.
    }
  }
}
