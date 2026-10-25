import { LucideDynamicIcon, LucideMenu, LucideX, LucideMoon, LucideSun } from '@lucide/angular';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
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

@Component({
  selector: 'demo-root',
  imports: [
    LucideDynamicIcon,
    LucideMenu,
    LucideX,
    DsyIcon,
    DsyButton,
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
  readonly themeIcons = { moon: LucideMoon, sun: LucideSun };
  readonly theme = signal<'light' | 'dark'>('light');
  readonly groups = showcaseGroups;
  readonly version = libraryPackage.version;
  private readonly breakpoints = inject(BreakpointObserver);
  readonly desktop = signal(this.breakpoints.isMatched('(min-width: 1024px)'));
  readonly navigationOpened = signal(this.desktop());
  private readonly navigation = viewChild<DsyDrawer>('navigationDrawer');
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('showcaseContent');

  constructor() {
    const injector = inject(Injector);
    this.breakpoints
      .observe('(min-width: 1024px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        this.desktop.set(matches);
        this.navigationOpened.set(matches);
      });
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        if (!this.desktop()) this.navigation()?.close({ restoreFocus: false });
        afterNextRender(() => this.content().nativeElement.focus({ preventScroll: true }), {
          injector,
        });
      });
  }

  toggleTheme() {
    this.theme.update((value) => (value === 'light' ? 'dark' : 'light'));
  }
}
