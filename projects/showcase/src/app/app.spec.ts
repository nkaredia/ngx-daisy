import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { showcasePages, showcaseGroups } from './showcase-pages';
import { App } from './app';
import { appConfig } from './app.config';

const desktopQuery = '(min-width: 1024px)';

function breakpointState(matches: boolean): BreakpointState {
  return { matches, breakpoints: { [desktopQuery]: matches } };
}

async function renderShowcase(path: string, desktop = true) {
  const breakpoints = new BehaviorSubject(breakpointState(desktop));
  TestBed.configureTestingModule({
    providers: [
      ...appConfig.providers,
      {
        provide: BreakpointObserver,
        useValue: {
          isMatched: () => breakpoints.value.matches,
          observe: () => breakpoints.asObservable(),
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(App);
  const router = TestBed.inject(Router);
  await fixture.whenStable();
  await router.navigateByUrl(path);
  await fixture.whenStable();
  return { fixture, router, breakpoints, root: fixture.nativeElement as HTMLElement };
}

function buttonNamed(root: HTMLElement, name: string) {
  const button = Array.from(root.querySelectorAll('button')).find(
    (button) => button.getAttribute('aria-label') === name || button.textContent?.trim() === name,
  );
  if (!button) throw new Error(`Expected a button named "${name}".`);
  return button;
}

describe('Showcase routes', () => {
  beforeEach(() => localStorage.removeItem('ngx-daisy.showcase-theme'));

  it('groups every route once and keeps branding and theme controls outside the scrolling list', async () => {
    const { root } = await renderShowcase('/buttons');
    expect(showcaseGroups.map((group) => group.label)).toEqual([
      'Actions',
      'Data Display',
      'Navigation',
      'Feedback',
      'Data Input',
      'Layout',
      'Mockup',
    ]);
    const paths = showcaseGroups.flatMap((group) => group.pages.map((page) => page.path));
    expect(new Set(paths).size).toBe(showcasePages.length);
    expect(paths).toHaveLength(70);
    expect(root.querySelector('.showcase-brand-name')?.textContent).toBe('ngx-daisy');
    expect(root.querySelector('.showcase-version')?.textContent).toMatch(/^v\d+\.\d+\.\d+/);
    expect(root.querySelectorAll('.showcase-navigation-group')).toHaveLength(7);
    expect(root.querySelector('dsy-dropdown')).not.toBeNull();
    expect(root.querySelector<HTMLInputElement>('input[dsyToggle]')?.checked).toBe(false);
    expect(root.querySelector('[aria-label="Open Theme Builder"]')).not.toBeNull();
    expect(root.querySelector('.showcase-mobile-titlebar')).toBeNull();
  });

  it('uses a closed overlay drawer on the theme builder and restores desktop navigation when leaving', async () => {
    const { fixture, router, root, breakpoints } = await renderShowcase('/themes');
    const navigation = root.querySelector<HTMLElement>('#showcase-navigation')!;
    expect(navigation.getAttribute('data-mode')).toBe('over');
    expect(navigation.getAttribute('data-opened')).toBe('false');
    expect(root.querySelector('.showcase-mobile-titlebar')).toBeNull();
    buttonNamed(root, 'Open component navigation').click();
    await fixture.whenStable();
    expect(navigation.getAttribute('data-opened')).toBe('true');
    buttonNamed(root, 'Close component navigation').click();
    await fixture.whenStable();
    expect(navigation.getAttribute('data-opened')).toBe('false');
    breakpoints.next(breakpointState(false));
    await fixture.whenStable();
    expect(root.querySelector('.showcase-mobile-titlebar')).toBeNull();
    expect(navigation.getAttribute('data-opened')).toBe('false');
    breakpoints.next(breakpointState(true));
    await fixture.whenStable();
    expect(navigation.getAttribute('data-mode')).toBe('over');
    expect(navigation.getAttribute('data-opened')).toBe('false');
    await router.navigateByUrl('/buttons');
    await fixture.whenStable();
    expect(navigation.getAttribute('data-mode')).toBe('side');
    expect(navigation.getAttribute('data-opened')).toBe('true');
    expect(root.querySelector('.showcase-floating-navigation')).toBeNull();
  });

  it('smoothly navigates documentation sections and honors reduced motion', async () => {
    const { fixture, root } = await renderShowcase('/buttons');
    const target = root.querySelector<HTMLElement>('#button-api')!;
    const scroll = vi.fn();
    target.scrollIntoView = scroll;
    const media = vi.fn();
    vi.stubGlobal('matchMedia', media);
    try {
      media.mockReturnValue({ matches: false } as MediaQueryList);
      root
        .querySelector<HTMLAnchorElement>('.documentation-section-links a[href$="#button-api"]')!
        .click();
      await fixture.whenStable();
      expect(scroll).toHaveBeenLastCalledWith({ behavior: 'smooth', block: 'start' });
      expect(document.activeElement).toBe(target);
      media.mockReturnValue({ matches: true } as MediaQueryList);
      root
        .querySelector<HTMLAnchorElement>('.documentation-section-links a[href$="#button-api"]')!
        .click();
      await fixture.whenStable();
      expect(scroll).toHaveBeenLastCalledWith({ behavior: 'instant', block: 'start' });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('redirects the root and unknown paths to the buttons page', async () => {
    const { fixture, router, root } = await renderShowcase('/');
    expect(router.url).toBe('/buttons');
    expect(root.querySelector('main h2')?.textContent?.trim()).toBe('Buttons');

    await router.navigateByUrl('/missing-component');
    await fixture.whenStable();
    expect(router.url).toBe('/buttons');
    expect(root.querySelector('main h2')?.textContent?.trim()).toBe('Buttons');
  });

  it('keeps the current component path and query parameters when skipping to the examples', async () => {
    const { fixture, router, root } = await renderShowcase('/icons?example=home');
    const skipLink = root.querySelector<HTMLAnchorElement>('.showcase-skip-link');
    const main = root.querySelector<HTMLElement>('main#showcase-content');
    const shell = root.querySelector('.showcase-shell');
    const iconDemo = root.querySelector('demo-icon-demo');

    expect(skipLink?.getAttribute('href')).toBe('/icons?example=home#showcase-content');
    skipLink!.focus();
    expect(document.activeElement).toBe(skipLink);
    skipLink!.click();
    await fixture.whenStable();

    expect(router.url).toBe('/icons?example=home#showcase-content');
    expect(root.querySelector('demo-icon-demo')).toBe(iconDemo);
    expect(root.querySelector('demo-button-demo')).toBeNull();
    expect(root.querySelector('.showcase-shell')).toBe(shell);
    expect(root.querySelector('main#showcase-content')).toBe(main);
    expect(document.activeElement).toBe(main);
  });

  it('renders each direct route in isolation with its active navigation link, title and focused main', async () => {
    const { fixture, router, root } = await renderShowcase('/buttons');
    const navigation = root.querySelector('nav[aria-label="Components"]');
    const main = root.querySelector<HTMLElement>('main#showcase-content');
    expect(navigation).not.toBeNull();
    expect(main?.tabIndex).toBe(-1);
    expect(
      Array.from(navigation!.querySelectorAll('a'), (link) => link.textContent?.trim()),
    ).toEqual(showcasePages.map((page) => page.label));

    for (const [path, label, selector] of [
      ['/buttons', 'Buttons', 'demo-button-demo'],
      ['/dropdowns', 'Dropdowns', 'demo-dropdown-demo'],
      ['/fabs', 'FAB / Speed Dial', 'demo-fab-demo'],
      ['/modals', 'Modals', 'demo-modal-demo'],
      ['/swaps', 'Swaps', 'demo-swap-demo'],
      ['/theme-controllers', 'Theme Controllers', 'demo-theme-controller-demo'],
      ['/inputs', 'Text Inputs', 'demo-input-demo'],
      ['/textareas', 'Textareas', 'demo-textarea-demo'],
      ['/selects', 'Selects', 'demo-select-demo'],
      ['/checkboxes', 'Checkboxes', 'demo-checkbox-demo'],
      ['/toggles', 'Toggles', 'demo-toggle-demo'],
      ['/ranges', 'Range Sliders', 'demo-range-demo'],
      ['/radios', 'Radio Groups', 'demo-radio-demo'],
      ['/filters', 'Filters', 'demo-filter-demo'],
      ['/ratings', 'Ratings', 'demo-rating-demo'],
      ['/file-inputs', 'File Inputs', 'demo-file-input-demo'],
      ['/otp', 'OTP', 'demo-otp-demo'],
      ['/calendars', 'Calendars', 'demo-calendar-demo'],
      ['/fieldsets', 'Fieldsets', 'demo-fieldset-demo'],
      ['/labels', 'Labels', 'demo-label-demo'],
      ['/validators', 'Validators', 'demo-validator-demo'],
      ['/form-fields', 'Form Fields', 'demo-form-field-demo'],
      ['/icons', 'Icons', 'demo-icon-demo'],
      ['/drawers', 'Drawers', 'demo-drawer-demo'],
      ['/loaders', 'Loaders', 'demo-loader-demo'],
      ['/badges', 'Badges', 'demo-badge-demo'],
      ['/avatars', 'Avatars', 'demo-avatar-demo'],
      ['/auras', 'Auras', 'demo-aura-demo'],
      ['/cards', 'Cards', 'demo-card-demo'],
      ['/chat', 'Chat Bubbles', 'demo-chat-demo'],
      ['/keyboard', 'Keyboard Shortcuts', 'demo-kbd-demo'],
      ['/lists', 'Lists', 'demo-list-demo'],
      ['/stats', 'Stats', 'demo-stat-demo'],
      ['/statuses', 'Status Indicators', 'demo-status-demo'],
      ['/timelines', 'Timelines', 'demo-timeline-demo'],
      ['/collapses', 'Collapse', 'demo-collapse-demo'],
      ['/accordions', 'Accordions', 'demo-accordion-demo'],
      ['/countdowns', 'Countdown', 'demo-countdown-demo'],
      ['/carousels', 'Carousels', 'demo-carousel-demo'],
      ['/diffs', 'Diff', 'demo-diff-demo'],
      ['/hover-3d', 'Hover 3D Cards', 'demo-hover-3d-demo'],
      ['/hover-galleries', 'Hover Galleries', 'demo-hover-gallery-demo'],
      ['/text-rotate', 'Text Rotate', 'demo-text-rotate-demo'],
      ['/tables', 'Tables', 'demo-table-demo'],
      ['/breadcrumbs', 'Breadcrumbs', 'demo-breadcrumbs-demo'],
      ['/docks', 'Docks', 'demo-dock-demo'],
      ['/links', 'Links', 'demo-link-demo'],
      ['/menus', 'Menus', 'demo-menu-demo'],
      ['/navbars', 'Navbars', 'demo-navbar-demo'],
      ['/pagination', 'Pagination', 'demo-pagination-demo'],
      ['/steps', 'Steps', 'demo-steps-demo'],
      ['/tabs', 'Tabs', 'demo-tabs-demo'],
      ['/megamenus', 'Megamenus', 'demo-megamenu-demo'],
      ['/alerts', 'Alerts', 'demo-alert-demo'],
      ['/progress', 'Progress', 'demo-progress-demo'],
      ['/radial-progress', 'Radial Progress', 'demo-radial-progress-demo'],
      ['/skeletons', 'Skeletons', 'demo-skeleton-demo'],
      ['/toasts', 'Toasts', 'demo-toast-demo'],
      ['/tooltips', 'Tooltips', 'demo-tooltip-demo'],
      ['/dividers', 'Dividers', 'demo-divider-demo'],
      ['/footers', 'Footers', 'demo-footer-demo'],
      ['/heroes', 'Heroes', 'demo-hero-demo'],
      ['/indicators', 'Indicators', 'demo-indicator-demo'],
      ['/joins', 'Join Groups', 'demo-join-demo'],
      ['/masks', 'Masks', 'demo-mask-demo'],
      ['/stacks', 'Stacks', 'demo-stack-demo'],
      ['/browser-mockups', 'Browser Mockups', 'demo-mockup-browser-demo'],
      ['/code-mockups', 'Code Mockups', 'demo-mockup-code-demo'],
      ['/phone-mockups', 'Phone Mockups', 'demo-mockup-phone-demo'],
      ['/window-mockups', 'Window Mockups', 'demo-mockup-window-demo'],
    ]) {
      await router.navigateByUrl(path);
      await fixture.whenStable();
      const links = Array.from(navigation!.querySelectorAll('a'));
      const activeLink = links.find((link) => link.textContent?.trim() === label);

      expect(router.url).toBe(path);
      expect(main?.querySelectorAll('h2')).toHaveLength(1);
      expect(main?.querySelector('h2')?.textContent?.trim()).toBe(label);
      expect(main?.querySelector(selector)).not.toBeNull();
      expect(main?.querySelector('demo-documentation-page')).not.toBeNull();
      const sectionLinks = main!.querySelectorAll<HTMLAnchorElement>(
        'demo-documentation-navigation a',
      );
      expect(sectionLinks).toHaveLength(6);
      for (const link of sectionLinks) {
        const id = new URL(link.href).hash.slice(1);
        expect(
          Array.from(main!.querySelectorAll('[id]')).some((element) => element.id === id),
        ).toBe(true);
      }
      if (path !== '/buttons') {
        expect(main?.querySelector('demo-component-documentation')).not.toBeNull();
        expect(main?.querySelector('demo-component-documentation pre code')?.textContent).toContain(
          '@ngx-daisy/cdk/',
        );
      }

      expect(main?.querySelectorAll('demo-playground').length).toBeGreaterThan(0);
      expect(
        main?.querySelector('demo-playground .playground-example')?.children.length,
      ).toBeGreaterThan(0);
      expect(
        main?.querySelectorAll(
          'demo-button-demo, demo-icon-demo, demo-drawer-demo, demo-loader-demo, demo-dropdown-demo, demo-fab-demo, demo-modal-demo, demo-swap-demo, demo-theme-controller-demo, demo-input-demo, demo-textarea-demo, demo-select-demo, demo-checkbox-demo, demo-toggle-demo, demo-range-demo, demo-radio-demo, demo-filter-demo, demo-rating-demo, demo-file-input-demo, demo-otp-demo, demo-calendar-demo, demo-fieldset-demo, demo-label-demo, demo-validator-demo, demo-form-field-demo, demo-badge-demo, demo-avatar-demo, demo-aura-demo, demo-card-demo, demo-chat-demo, demo-kbd-demo, demo-list-demo, demo-stat-demo, demo-status-demo, demo-timeline-demo, demo-collapse-demo, demo-accordion-demo, demo-countdown-demo, demo-carousel-demo, demo-diff-demo, demo-hover-3d-demo, demo-hover-gallery-demo, demo-text-rotate-demo, demo-table-demo, demo-breadcrumbs-demo, demo-dock-demo, demo-link-demo, demo-menu-demo, demo-navbar-demo, demo-pagination-demo, demo-steps-demo, demo-tabs-demo, demo-megamenu-demo, demo-alert-demo, demo-progress-demo, demo-radial-progress-demo, demo-skeleton-demo, demo-toast-demo, demo-tooltip-demo, demo-divider-demo, demo-footer-demo, demo-hero-demo, demo-indicator-demo, demo-join-demo, demo-mask-demo, demo-stack-demo, demo-mockup-browser-demo, demo-mockup-code-demo, demo-mockup-phone-demo, demo-mockup-window-demo',
        ),
      ).toHaveLength(1);
      expect(activeLink?.getAttribute('href')).toBe(path);
      expect(activeLink?.getAttribute('aria-current')).toBe('page');
      expect(links.filter((link) => link.getAttribute('aria-current') === 'page')).toHaveLength(1);
      expect(document.title).toBe(`${label} | ngx-daisy`);
      expect(document.activeElement).toBe(main);
    }
  });

  it('keeps static button examples and icon color controls on their own pages', async () => {
    const { fixture, router, root } = await renderShowcase('/buttons');
    expect(buttonNamed(root, 'Primary').classList.contains('btn-primary')).toBe(true);

    await router.navigateByUrl('/icons');
    await fixture.whenStable();
    const select = root.querySelector<HTMLSelectElement>('main select');
    const home = root.querySelector<HTMLElement>('dsy-icon[aria-label="Home"]');
    expect(select?.value).toBe('primary');
    expect(home?.querySelector('svg[lucideHouse]')).not.toBeNull();

    select!.value = 'success';
    select!.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(home?.classList.contains('dsy-icon-success')).toBe(true);
  });

  it('selects, persists and retains built-in themes while component navigation changes the page', async () => {
    const { fixture, router, root } = await renderShowcase('/buttons');
    const shell = root.querySelector<HTMLElement>('.showcase-shell');
    const main = root.querySelector('main#showcase-content');
    expect(shell?.getAttribute('data-theme')).toBe('light');

    fixture.componentInstance.selectTheme('daisy:dracula');
    await fixture.whenStable();
    expect(shell?.getAttribute('data-theme')).toBe('dracula');
    expect(localStorage.getItem('ngx-daisy.showcase-theme')).toBe('dracula');

    const iconsLink = Array.from(root.querySelectorAll<HTMLAnchorElement>('nav a')).find(
      (link) => link.textContent?.trim() === 'Icons',
    );
    iconsLink!.click();
    await fixture.whenStable();
    expect(router.url).toBe('/icons');
    expect(root.querySelector('.showcase-shell')).toBe(shell);
    expect(root.querySelector('main#showcase-content')).toBe(main);
    expect(shell?.getAttribute('data-theme')).toBe('dracula');
  });

  it('removes the page-loader preview and cancels its timeout when navigating away', async () => {
    const { fixture, router, root } = await renderShowcase('/loaders');
    const schedule = vi.spyOn(globalThis, 'setTimeout');
    const cancel = vi.spyOn(globalThis, 'clearTimeout');
    try {
      buttonNamed(root, 'Preview page loader').click();
      await fixture.whenStable();
      const pageLoader = root.querySelector<HTMLElement>('dsy-loader[data-placement="page"]');
      expect(pageLoader?.hidden).toBe(false);
      expect(pageLoader?.getAttribute('role')).toBe('status');
      const previewCallIndex = schedule.mock.calls.findIndex(([, delay]) => delay === 2000);
      expect(previewCallIndex).toBeGreaterThanOrEqual(0);
      const previewTimer = schedule.mock.results[previewCallIndex].value;

      await router.navigateByUrl('/buttons');
      await fixture.whenStable();
      expect(root.querySelector('demo-loader-demo')).toBeNull();
      expect(root.querySelector('dsy-loader[data-placement="page"]')).toBeNull();
      expect(cancel).toHaveBeenCalledWith(previewTimer);
    } finally {
      fixture.destroy();
      vi.restoreAllMocks();
    }
  });

  it('opens mobile component navigation as a modal with expanded state and background inertness', async () => {
    const { fixture, root } = await renderShowcase('/buttons', false);
    const menu = root.querySelector<HTMLButtonElement>('[aria-controls="showcase-navigation"]')!;
    const navigation = root.querySelector<HTMLElement>('#showcase-navigation')!;
    const panel = navigation.querySelector<HTMLElement>('.dsy-drawer-panel')!;
    const content = root.querySelector('dsy-drawer-content')!;

    expect(menu.getAttribute('aria-label')).toBe('Open component navigation');
    expect(menu.textContent?.trim()).toBe('');
    expect(root.querySelector('.showcase-mobile-titlebar .showcase-brand-name')?.textContent).toBe(
      'ngx-daisy',
    );
    expect(root.querySelector('.showcase-mobile-titlebar .showcase-version')?.textContent).toMatch(
      /^v\d+\.\d+\.\d+/,
    );
    expect(navigation.querySelector('.showcase-brand')).toBeNull();
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(navigation.getAttribute('data-mode')).toBe('over');
    expect(panel.hasAttribute('inert')).toBe(true);

    menu.focus();
    menu.click();
    await fixture.whenStable();

    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(navigation.getAttribute('data-opened')).toBe('true');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-label')).toBe('Component navigation');
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(content.hasAttribute('inert')).toBe(true);
    expect(navigation.querySelectorAll('.cdk-focus-trap-anchor')).toHaveLength(2);
    expect(panel.contains(document.activeElement)).toBe(true);
  });

  it('closes mobile navigation after a route click, focuses its main content and keeps the theme', async () => {
    const { fixture, router, root } = await renderShowcase('/buttons', false);
    const shell = root.querySelector<HTMLElement>('.showcase-shell')!;
    const main = root.querySelector<HTMLElement>('main#showcase-content')!;
    const menu = root.querySelector<HTMLButtonElement>('[aria-controls="showcase-navigation"]')!;
    const navigation = root.querySelector<HTMLElement>('#showcase-navigation')!;

    menu.focus();
    menu.click();
    await fixture.whenStable();
    fixture.componentInstance.selectTheme('daisy:night');
    await fixture.whenStable();
    navigation.querySelector<HTMLAnchorElement>('nav a[href="/drawers"]')!.click();
    await fixture.whenStable();

    expect(router.url).toBe('/drawers');
    expect(main.querySelector('demo-drawer-demo')).not.toBeNull();
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(navigation.getAttribute('data-opened')).toBe('false');
    expect(navigation.querySelector('.dsy-drawer-panel')?.hasAttribute('aria-modal')).toBe(false);
    expect(navigation.querySelectorAll('.cdk-focus-trap-anchor')).toHaveLength(0);
    expect(main.closest('[inert]')).toBeNull();
    expect(document.activeElement).toBe(main);
    expect(shell.getAttribute('data-theme')).toBe('night');
    expect(root.querySelector('.showcase-shell')).toBe(shell);
  });

  it('returns focus to Menu when Escape dismisses mobile navigation', async () => {
    const { fixture, root } = await renderShowcase('/icons', false);
    const menu = root.querySelector<HTMLButtonElement>('[aria-controls="showcase-navigation"]')!;
    const navigation = root.querySelector<HTMLElement>('#showcase-navigation')!;
    menu.focus();
    menu.click();
    await fixture.whenStable();
    const close = navigation.querySelector<HTMLButtonElement>(
      '[aria-label="Close component navigation"]',
    )!;
    close.focus();
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    close.dispatchEvent(escape);
    await fixture.whenStable();

    expect(escape.defaultPrevented).toBe(true);
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menu);
    expect(root.querySelector('dsy-drawer-content')?.hasAttribute('inert')).toBe(false);
    expect(navigation.querySelectorAll('.cdk-focus-trap-anchor')).toHaveLength(0);
  });

  it('changes an open mobile modal to a desktop side panel and returns to a closed mobile menu without modal state', async () => {
    const { fixture, root, breakpoints } = await renderShowcase('/buttons', false);
    const navigation = root.querySelector<HTMLElement>('#showcase-navigation')!;
    const panel = navigation.querySelector<HTMLElement>('.dsy-drawer-panel')!;
    const content = root.querySelector('dsy-drawer-content')!;
    const menu = root.querySelector<HTMLButtonElement>('[aria-controls="showcase-navigation"]')!;
    menu.focus();
    menu.click();
    await fixture.whenStable();
    expect(content.hasAttribute('inert')).toBe(true);

    breakpoints.next(breakpointState(true));
    await fixture.whenStable();

    expect(root.querySelector('[aria-controls="showcase-navigation"]')).toBeNull();
    expect(navigation.getAttribute('data-mode')).toBe('side');
    expect(navigation.getAttribute('data-opened')).toBe('true');
    expect(panel.hasAttribute('aria-modal')).toBe(false);
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(content.hasAttribute('inert')).toBe(false);
    expect(navigation.querySelectorAll('.cdk-focus-trap-anchor')).toHaveLength(0);

    breakpoints.next(breakpointState(false));
    await fixture.whenStable();

    const mobileMenu = root.querySelector<HTMLButtonElement>(
      '[aria-controls="showcase-navigation"]',
    )!;
    expect(mobileMenu.getAttribute('aria-expanded')).toBe('false');
    expect(navigation.getAttribute('data-mode')).toBe('over');
    expect(navigation.getAttribute('data-opened')).toBe('false');
    expect(panel.hasAttribute('aria-modal')).toBe(false);
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(content.hasAttribute('inert')).toBe(false);
    expect(navigation.querySelectorAll('.cdk-focus-trap-anchor')).toHaveLength(0);
    expect(document.documentElement.classList.contains('cdk-global-scrollblock')).toBe(false);
    mobileMenu.focus();
    expect(document.activeElement).toBe(mobileMenu);
  });
});
