import { NativeDisplayExample } from './display-example/display-example';
import { NativeSidebarMotion } from './shell/sidebar-motion';
import { DsyMotionPresence } from '@ngx-daisy/native/motion';
import { NativeFormCompositionExample } from './form-composition-example/form-composition-example';
import { NativeSelectionExample } from './selection-example/selection-example';
import { NativeDataInputExample } from './data-input-example/data-input-example';
import { NativeIconButton } from './shell/icon-button';
import { DsyPopoverService } from '@ngx-daisy/native/popover';
import { NativeThemePicker } from './shell/theme-picker';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, ApplicationSettings } from '@nativescript/core';
import type {
  EventData,
  View,
  ScrollView,
  AndroidActivityBackPressedEventData,
} from '@nativescript/core';
import { Sun, Moon, Menu, X, Paintbrush } from 'lucide';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsyIcon } from '@ngx-daisy/native/icon';

import {
  DsyTheme,
  defineDaisyTheme,
  resolveNativeTheme,
  type DsyThemeDefinition,
} from '@ngx-daisy/native/theme';
import { NativeActionsExample } from './actions-example/actions-example';
import { NativeIconExample } from './icon-example/icon-example';
import { NativeButtonExample } from './button-example/button-example';
import { NativeThemeEditor } from './shell/theme-editor';
import { nativeGroups, nativePages, type NativePageId } from './shell/catalog';
import { nativeThemes } from './shell/themes';
import { lucideArtwork } from './icons/svg-artwork';
import libraryPackage from '../../../ngx-daisy-native/package.json';

function storedCustom(): DsyThemeDefinition | undefined {
  try {
    const raw = ApplicationSettings.getString('ngx-daisy.custom-theme', '');
    if (raw) {
      const theme = defineDaisyTheme(JSON.parse(raw));
      resolveNativeTheme(theme);
      return theme;
    }
  } catch {
    /* Ignore invalid persisted drafts. */
  }
  return undefined;
}
function storedTheme(): DsyThemeDefinition {
  const name = ApplicationSettings.getString(
    'ngx-daisy.theme',
    ApplicationSettings.getBoolean('ngx-daisy.dark', false) ? 'dark' : 'light',
  );
  return (
    (name === 'custom' ? storedCustom() : undefined) ??
    nativeThemes.find((theme) => theme.name === name) ??
    nativeThemes.find((theme) => theme.name === 'light')!
  );
}
@Component({
  selector: 'dsy-native-showcase',
  standalone: true,
  imports: [
    NativeDisplayExample,
    DsyMotionPresence,
    NativeSidebarMotion,
    NativeScriptCommonModule,
    NativeIconButton,
    NativeThemePicker,
    DsyButton,
    DsyIcon,
    DsyTheme,
    NativeActionsExample,
    NativeIconExample,
    NativeButtonExample,
    NativeThemeEditor,
    NativeDataInputExample,
    NativeSelectionExample,
    NativeFormCompositionExample,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeShowcase {
  readonly version = libraryPackage.version;
  readonly page = signal<NativePageId>('buttons');
  readonly groups = nativeGroups;
  readonly theme = signal(storedTheme());
  readonly savedCustom = signal(storedCustom());
  readonly themes = computed(() => [
    ...nativeThemes.filter((theme) => theme.name !== 'light' && theme.name !== 'dark'),
    ...(this.savedCustom() ? [this.savedCustom()!] : []),
  ]);
  readonly dark = computed(() => this.theme().colorScheme === 'dark');
  readonly viewportWidth = signal(390);
  readonly desktop = signal(false);
  readonly contentWidth = computed(() =>
    Math.max(
      1,
      Math.min(
        1056,
        this.viewportWidth() - (this.persistentNavigation() ? 288 : 0) - (this.desktop() ? 48 : 32),
      ),
    ),
  );
  readonly currentPage = computed(() => nativePages.find((page) => page.id === this.page()));
  readonly description = computed(() =>
    this.page() === 'themes'
      ? 'Create a theme that brings your interface to life. Preview, customize and save your colors.'
      : (this.currentPage()?.description ?? ''),
  );
  readonly persistentNavigation = computed(() => this.desktop() && this.page() !== 'themes');
  readonly navigationMounted = signal(false);
  readonly navigationOpened = signal(false);
  readonly overlayOpen = computed(() => this.navigationOpened() && !this.persistentNavigation());
  readonly title = computed(() =>
    this.page() === 'themes'
      ? 'Theme Builder'
      : nativePages.find((page) => page.id === this.page())!.label,
  );
  readonly menu = lucideArtwork(Menu);
  readonly closeIcon = lucideArtwork(X);
  readonly paintbrush = lucideArtwork(Paintbrush);
  readonly sun = lucideArtwork(Sun);
  readonly moon = lucideArtwork(Moon);
  private readonly scroll = viewChild<ElementRef<ScrollView>>('pageScroll');
  private readonly popovers = inject(DsyPopoverService);
  constructor() {
    const back = (event: AndroidActivityBackPressedEventData) => {
      if (this.popovers.closeActive()) {
        event.cancel = true;
      } else if (this.overlayOpen()) {
        event.cancel = true;
        this.navigationOpened.set(false);
      } else if (this.page() !== 'buttons') {
        event.cancel = true;
        this.selectPage('buttons');
      }
    };
    Application.android?.on('activityBackPressed', back);
    inject(DestroyRef).onDestroy(() => Application.android?.off('activityBackPressed', back));
  }
  openNavigation(): void {
    this.navigationMounted.set(true);
    this.navigationOpened.set(true);
  }
  onLayout(event: unknown): void {
    const width = ((event as EventData).object as View).getActualSize().width;
    if (width <= 0) return;
    this.viewportWidth.set(width);
    const desktop = width >= 1024;
    if (desktop !== this.desktop()) {
      this.desktop.set(desktop);
      this.navigationOpened.set(false);
    }
  }
  selectPage(page: NativePageId): void {
    this.page.set(page);
    this.navigationOpened.set(false);
    this.scroll()?.nativeElement.scrollToVerticalOffset(0, false);
  }
  selectTheme(theme: DsyThemeDefinition): void {
    this.theme.set(theme);
    ApplicationSettings.setString('ngx-daisy.theme', theme.name);
    if (theme.name === 'custom') this.savedCustom.set(theme);
    if (theme.name === 'custom')
      ApplicationSettings.setString('ngx-daisy.custom-theme', JSON.stringify(theme));
  }
  colorMode(event: unknown): void {
    const checked = (event as EventData & { value: boolean }).value;
    if (checked === (this.theme().name === 'dark')) return;
    if (typeof checked === 'boolean')
      this.selectTheme(nativeThemes.find((theme) => theme.name === (checked ? 'dark' : 'light'))!);
  }
}
