import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import daisyThemes from 'daisyui/theme/object';

const root = fileURLToPath(new URL('../', import.meta.url));
// Use the same Sass compiler as the Angular build, without adding another toolchain.
const require = createRequire(import.meta.url);
const buildRequire = createRequire(require.resolve('@angular/build/package.json'));
const sass = buildRequire('sass');
const output = path.join(root, '.angular/daisyui-compat');
await mkdir(output, { recursive: true });
const styles = [
  'breadcrumbs/breadcrumbs.scss',
  'dock/dock.scss',
  'link/link.scss',
  'megamenu/megamenu.scss',
  'menu/menu.scss',
  'navbar/navbar.scss',
  'pagination/pagination.scss',
  'steps/steps.scss',
  'tabs/tabs.scss',
  'alert/alert.scss',
  'progress/progress.scss',
  'radial-progress/radial-progress.scss',
  'skeleton/skeleton.scss',
  'toast/toast.scss',
  'tooltip/tooltip.scss',
  'divider/divider.scss',
  'footer/footer.scss',
  'hero/hero.scss',
  'indicator/indicator.scss',
  'join/join.scss',
  'mask/mask.scss',
  'stack/stack.scss',
  'mockup-browser/mockup-browser.scss',
  'mockup-code/mockup-code.scss',
  'mockup-phone/mockup-phone.scss',
  'mockup-window/mockup-window.scss',
  'accordion/accordion.scss',
  'avatar/avatar.scss',
  'aura/aura.scss',
  'badge/badge.scss',
  'card/card.scss',
  'carousel/carousel.scss',
  'chat/chat.scss',
  'collapse/collapse.scss',
  'countdown/countdown.scss',
  'diff/diff.scss',
  'hover-3d/hover-3d.scss',
  'hover-gallery/hover-gallery.scss',
  'kbd/kbd.scss',
  'list/list.scss',
  'stat/stat.scss',
  'status/status.scss',
  'table/table.scss',
  'text-rotate/text-rotate.scss',
  'timeline/timeline.scss',
  'form-field/form-field.component.scss',
  'textarea/textarea.scss',
  'calendar/calendar.component.scss',
  'file-input/file-input.component.scss',
  'filter/filter.component.scss',
  'otp/otp.component.scss',
  'radio/radio.component.scss',
  'rating/rating.component.scss',
  'button/button.component.scss',
  'dropdown/dropdown.component.scss',
  'modal/modal.component.scss',
  'swap/swap.component.scss',
  'fab/fab.component.scss',
  'icon/icon.component.scss',
  'loader/loader.component.scss',
  'drawer/drawer-container.component.scss',
  'drawer/drawer-content.component.scss',
  'drawer/drawer.component.scss',
]
  .map((file) => sass.compile(path.join(root, 'projects/ngx-daisy', file)).css)
  .join('\n');
const libraryStyles = postcss.parse(styles);

const remainingClasses = [
  'tab',
  'breadcrumbs',
  'dock',
  'dock-xs',
  'dock-sm',
  'dock-md',
  'dock-lg',
  'dock-xl',
  'dock-active',
  'dock-label',
  'link',
  'link-neutral',
  'link-primary',
  'link-secondary',
  'link-accent',
  'link-info',
  'link-success',
  'link-warning',
  'link-error',
  'link-hover',
  'megamenu',
  'megamenu-xs',
  'megamenu-sm',
  'megamenu-md',
  'megamenu-lg',
  'megamenu-xl',
  'megamenu-wide',
  'megamenu-full',
  'megamenu-vertical',
  'menu',
  'menu-xs',
  'menu-sm',
  'menu-md',
  'menu-lg',
  'menu-xl',
  'menu-horizontal',
  'menu-vertical',
  'menu-paged',
  'menu-active',
  'menu-disabled',
  'menu-focus',
  'menu-title',
  'menu-dropdown',
  'menu-dropdown-toggle',
  'menu-dropdown-show',
  'navbar',
  'navbar-start',
  'navbar-center',
  'navbar-end',
  'steps',
  'steps-horizontal',
  'steps-vertical',
  'step',
  'step-neutral',
  'step-primary',
  'step-secondary',
  'step-accent',
  'step-info',
  'step-success',
  'step-warning',
  'step-error',
  'step-icon',
  'tab-active',
  'tab-disabled',
  'tab-content',
  'tabs',
  'tabs-border',
  'tabs-box',
  'tabs-lift',
  'tabs-xs',
  'tabs-sm',
  'tabs-md',
  'tabs-lg',
  'tabs-xl',
  'tabs-top',
  'tabs-bottom',
  'alert',
  'alert-info',
  'alert-success',
  'alert-warning',
  'alert-error',
  'alert-outline',
  'alert-dash',
  'alert-soft',
  'alert-horizontal',
  'alert-vertical',
  'progress',
  'progress-neutral',
  'progress-primary',
  'progress-secondary',
  'progress-accent',
  'progress-info',
  'progress-success',
  'progress-warning',
  'progress-error',
  'radial-progress',
  'skeleton',
  'skeleton-text',
  'toast',
  'toast-start',
  'toast-center',
  'toast-end',
  'toast-top',
  'toast-middle',
  'toast-bottom',
  'tooltip-content',
  'tooltip',
  'tooltip-top',
  'tooltip-center',
  'tooltip-open',
  'tooltip-primary',
  'tooltip-secondary',
  'tooltip-accent',
  'tooltip-info',
  'tooltip-success',
  'tooltip-warning',
  'tooltip-error',
  'tooltip-bottom',
  'tooltip-left',
  'tooltip-right',
  'tooltip-start',
  'tooltip-end',
  'divider',
  'divider-neutral',
  'divider-primary',
  'divider-secondary',
  'divider-accent',
  'divider-info',
  'divider-success',
  'divider-warning',
  'divider-error',
  'divider-vertical',
  'divider-horizontal',
  'divider-start',
  'divider-end',
  'footer',
  'footer-horizontal',
  'footer-vertical',
  'footer-center',
  'footer-title',
  'hero',
  'hero-content',
  'hero-overlay',
  'indicator',
  'indicator-item',
  'indicator-start',
  'indicator-center',
  'indicator-end',
  'indicator-top',
  'indicator-middle',
  'indicator-bottom',
  'join',
  'join-horizontal',
  'join-vertical',
  'join-item',
  'mask',
  'mask-squircle',
  'mask-heart',
  'mask-hexagon',
  'mask-hexagon-2',
  'mask-decagon',
  'mask-pentagon',
  'mask-diamond',
  'mask-circle',
  'mask-star',
  'mask-star-2',
  'mask-triangle',
  'mask-triangle-2',
  'mask-triangle-3',
  'mask-triangle-4',
  'mask-half-1',
  'mask-half-2',
  'stack',
  'stack-top',
  'stack-bottom',
  'stack-start',
  'stack-end',
  'mockup-browser',
  'mockup-browser-toolbar',
  'mockup-code',
  'mockup-phone-camera',
  'mockup-phone-display',
  'mockup-phone',
  'mockup-window',
];

const dataDisplayClasses = [
  'loading',
  'loading-spinner',
  'loading-ring',
  'loading-dots',
  'loading-bars',
  'loading-ball',
  'loading-infinity',
  'loading-xs',
  'loading-sm',
  'loading-md',
  'loading-lg',
  'loading-xl',
  'row-hover',
  'image-full',
  'avatar',
  'avatar-online',
  'avatar-offline',
  'avatar-placeholder',
  'avatar-group',
  'aura',
  'aura-gold',
  'aura-silver',
  'aura-rainbow',
  'aura-holo',
  'aura-xs',
  'aura-sm',
  'aura-md',
  'aura-lg',
  'aura-xl',
  'aura-dual',
  'aura-glow',
  'badge',
  'badge-neutral',
  'badge-primary',
  'badge-secondary',
  'badge-accent',
  'badge-info',
  'badge-success',
  'badge-warning',
  'badge-error',
  'badge-xs',
  'badge-sm',
  'badge-md',
  'badge-lg',
  'badge-xl',
  'badge-outline',
  'badge-dash',
  'badge-soft',
  'badge-ghost',
  'card',
  'card-xs',
  'card-sm',
  'card-md',
  'card-lg',
  'card-xl',
  'card-border',
  'card-dash',
  'card-side',
  'card-body',
  'card-title',
  'card-actions',
  'carousel-item',
  'carousel',
  'carousel-vertical',
  'carousel-horizontal',
  'carousel-start',
  'carousel-center',
  'carousel-end',
  'chat',
  'chat-start',
  'chat-end',
  'chat-bubble',
  'chat-bubble-neutral',
  'chat-bubble-primary',
  'chat-bubble-secondary',
  'chat-bubble-accent',
  'chat-bubble-info',
  'chat-bubble-success',
  'chat-bubble-warning',
  'chat-bubble-error',
  'chat-header',
  'chat-footer',
  'chat-image',
  'collapse-title',
  'collapse-content',
  'collapse',
  'collapse-open',
  'collapse-close',
  'collapse-arrow',
  'collapse-plus',
  'countdown',
  'diff',
  'diff-item-1',
  'diff-item-2',
  'diff-resizer',
  'hover-3d',
  'hover-gallery',
  'kbd',
  'kbd-xs',
  'kbd-sm',
  'kbd-md',
  'kbd-lg',
  'kbd-xl',
  'list',
  'list-row',
  'list-col-grow',
  'list-col-wrap',
  'stats',
  'stats-horizontal',
  'stats-vertical',
  'stat-title',
  'stat-value',
  'stat-desc',
  'stat-figure',
  'stat-actions',
  'status',
  'status-neutral',
  'status-primary',
  'status-secondary',
  'status-accent',
  'status-info',
  'status-success',
  'status-warning',
  'status-error',
  'status-xs',
  'status-sm',
  'status-md',
  'status-lg',
  'status-xl',
  'table-xs',
  'table-sm',
  'table-md',
  'table-lg',
  'table-xl',
  'table-zebra',
  'table-pin-rows',
  'table-pin-cols',
  'text-rotate',
  'timeline',
  'timeline-horizontal',
  'timeline-vertical',
  'timeline-compact',
  'timeline-snap-icon',
  'timeline-start',
  'timeline-middle',
  'timeline-end',
  'timeline-box',
  'stat',
  'table',
];

const buttonClasses = [
  'btn',
  'btn-neutral',
  'btn-primary',
  'btn-secondary',
  'btn-accent',
  'btn-info',
  'btn-success',
  'btn-warning',
  'btn-error',
  'btn-xs',
  'btn-sm',
  'btn-md',
  'btn-lg',
  'btn-xl',
  'btn-outline',
  'btn-soft',
  'btn-ghost',
  'btn-link',
  'btn-dash',
  'btn-circle',
  'btn-square',
  'btn-wide',
  'btn-block',
  'btn-active',
  'btn-disabled',
];
const drawerClasses = [
  'drawer',
  'drawer-toggle',
  'drawer-open',
  'drawer-end',
  'drawer-side',
  'drawer-content',
  'drawer-overlay',
];

const actionClasses = [
  'dropdown',
  'dropdown-content',
  'dropdown-start',
  'dropdown-center',
  'dropdown-end',
  'dropdown-top',
  'dropdown-bottom',
  'dropdown-left',
  'dropdown-right',
  'dropdown-hover',
  'dropdown-open',
  'dropdown-close',
  'menu',
  'fab',
  'fab-flower',
  'fab-close',
  'fab-main-action',
  'modal',
  'modal-box',
  'modal-action',
  'modal-backdrop',
  'modal-open',
  'modal-top',
  'modal-middle',
  'modal-bottom',
  'modal-start',
  'modal-end',
  'swap',
  'swap-on',
  'swap-off',
  'swap-indeterminate',
  'swap-active',
  'swap-rotate',
  'swap-flip',
];

const inputFamilies = [
  'input',
  'textarea',
  'select',
  'checkbox',
  'toggle',
  'range',
  'radio',
  'file-input',
  'otp',
];
const calendarParts = [
  'rdp-months',
  'rdp-month',
  'rdp-month_grid',
  'rdp-month_caption',
  'rdp-caption_label',
  'rdp-nav',
  'rdp-button_previous',
  'rdp-button_next',
  'rdp-day',
  'rdp-day_button',
  'rdp-selected',
  'rdp-today',
  'rdp-outside',
  'rdp-disabled',
  'rdp-weekday',
  'rdp-week',
  'rdp-chevron',
];

const dataInputClasses = [
  'fieldset-label',
  'react-day-picker',
  ...inputFamilies.flatMap((family) => [
    family,
    ...[
      'neutral',
      'primary',
      'secondary',
      'accent',
      'info',
      'success',
      'warning',
      'error',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ].map((modifier) => family + '-' + modifier),
  ]),
  'input-ghost',
  'textarea-ghost',
  'select-ghost',
  'file-input-ghost',
  'range-vertical',
  'rating',
  'rating-xs',
  'rating-sm',
  'rating-md',
  'rating-lg',
  'rating-xl',
  'rating-half',
  'rating-hidden',
  'filter',
  'filter-reset',
  'label',
  'floating-label',
  'fieldset',
  'fieldset-legend',
  'validator',
  'validator-hint',
  'mask',
  'mask-star',
  'mask-star-2',
  'mask-heart',
  'mask-circle',
  'mask-half-1',
  'mask-half-2',
];

function rulesContaining(ast, text) {
  const rules = [];
  ast.walkRules((rule) => {
    if (rule.selector.replaceAll('"', '').replaceAll("'", '').includes(text)) rules.push(rule);
  });
  return rules;
}
function hasDeclaration(ast, prop, value) {
  let found = false;
  ast.walkDecls(prop, (decl) => {
    if (value === undefined || decl.value === value) found = true;
  });
  return found;
}
function selector(name) {
  return '.' + name.replaceAll(':', '\\:');
}

function hasDrawerStyles(ast, name) {
  // Variants may still reference an excluded component; check its structural declarations.
  return rulesContaining(ast, selector(name)).some((rule) =>
    rule.nodes?.some((node) => node.type === 'decl' && node.prop === 'display'),
  );
}

const cases = [
  { name: 'default' },
  { name: 'all-themes', themes: 'all' },
  { name: 'no-themes', themes: 'false' },
  { name: 'scoped-root', scoped: true },
  { name: 'include', include: 'button' },
  {
    name: 'exclude',
    exclude:
      'button, drawer, dropdown, fab, modal, swap, menu, input, textarea, select, checkbox, toggle, range, radio, fileinput, otp, rating, filter, label, fieldset, validator, breadcrumbs, dock, link, megamenu, navbar, steps, tab, alert, progress, radialprogress, skeleton, toast, tooltip, divider, footer, hero, indicator, join, stack, mockup, mask, avatar, aura, badge, card, carousel, chat, collapse, countdown, diff, hover3d, hovergallery, kbd, list, stat, status, table, textrotate, timeline, loading, rootscrollgutter, rootscrolllock',
  },
  {
    name: 'include-data-inputs',
    include:
      'button, input, textarea, select, checkbox, toggle, range, radio, fileinput, otp, rating, filter, label, fieldset, validator, mask, calendar',
  },
  {
    name: 'include-data-display',
    include:
      'button, avatar, aura, badge, card, carousel, chat, collapse, countdown, diff, hover3d, hovergallery, kbd, list, stat, status, table, textrotate, timeline, loading',
  },
  {
    name: 'include-remaining',
    include:
      'button, breadcrumbs, dock, link, megamenu, menu, navbar, steps, tab, alert, progress, radialprogress, skeleton, toast, tooltip, divider, footer, hero, indicator, join, mask, stack, mockup',
  },
  { name: 'daisy-prefix', prefix: 'd-' },
  { name: 'tailwind-prefix', tailwindPrefix: 'tw' },
  { name: 'both-prefixes', prefix: 'd-', tailwindPrefix: 'tw', scoped: true, custom: true },
  { name: 'custom-theme', custom: true },
  { name: 'logs', logs: true },
];

for (const config of cases) {
  const { prefix = '', tailwindPrefix = '' } = config;
  const tw = (name) => `${tailwindPrefix ? `${tailwindPrefix}:` : ''}${name}`;
  const daisy = (name) => tw(prefix + name);
  const markup = (name) => (tailwindPrefix ? `${daisy(name)} ${prefix}${name}` : daisy(name));
  const classes = [
    ...buttonClasses.map(daisy),
    ...drawerClasses.map(daisy),
    ...actionClasses.map(daisy),
    ...dataInputClasses.map(daisy),
    ...dataDisplayClasses.map(daisy),
    ...remainingClasses.map(daisy),
    prefix + 'theme-controller',
    ...[
      'bg-primary',
      'text-primary-content',
      'text-error',
      'text-success',
      'text-xl',
      'w-10',
      'w-80',
      'rounded-box',
    ].map(tw),
    tw(`${prefix}is-drawer-open:text-success`),
    tw(`${prefix}is-drawer-close:text-error`),
  ];
  const source = `
    @import "tailwindcss" ${tailwindPrefix ? `prefix(${tailwindPrefix})` : ''} source(none);
    @plugin "daisyui" {
      themes: ${config.themes ?? 'light --default, dark --prefersdark'};
      root: "${config.scoped ? '#compat-root' : ':root'}";
      prefix: "${prefix}";
      logs: ${config.logs ?? false};
      ${config.include ? `include: ${config.include};` : ''}
      ${config.exclude ? `exclude: ${config.exclude};` : ''}
    }
    @source inline("${classes.join(' ')}");
    ${
      config.custom
        ? `@plugin "daisyui/theme" {
      name: "compat-brand";
      --color-primary: #123456;
      --color-primary-content: #ffffff;
      --radius-field: 1.5rem;
      --radius-box: 1.25rem;
      --radius-selector: 0.5rem;
      --size-field: 0.3rem;
      --size-selector: 0.5rem;
      --border: 3px;
      --depth: 0;
      --noise: 1;
    }`
        : ''
    }
  `;
  const logs = [];
  const previousLog = console.log;
  let result;
  try {
    console.log = (...args) => logs.push(args.join(' '));
    result = await postcss([tailwind({ base: root, optimize: false })]).process(source, {
      from: path.join(root, `.angular/daisyui-compat/${config.name}.css`),
    });
  } finally {
    console.log = previousLog;
  }
  const ast = result.root;
  assert.equal(
    logs.some((line) => line.includes('daisyUI')),
    !!config.logs,
    `${config.name}: logs`,
  );
  if (!config.exclude) {
    for (const name of buttonClasses) {
      assert.ok(rulesContaining(ast, selector(daisy(name))).length, `${config.name}: ${name}`);
    }
    assert.ok(hasDeclaration(ast, `--${prefix}btn-bg`), `${config.name}: internal variables`);
  } else {
    assert.equal(hasDeclaration(ast, `--${prefix}btn-bg`), false);
    assert.equal(hasDrawerStyles(ast, daisy('drawer-side')), false);
    assert.equal(hasDeclaration(ast, `--${prefix}page-scroll-lock`), false);
  }
  if (config.include) assert.equal(hasDrawerStyles(ast, daisy('drawer-side')), false);
  if (config.themes === 'false') {
    assert.equal(hasDeclaration(ast, '--color-primary'), false);
  } else {
    assert.ok(hasDeclaration(ast, '--color-primary'), `${config.name}: theme variables`);
    assert.ok(rulesContaining(ast, '[data-theme=dark]').length);
  }
  if (config.scoped) assert.ok(rulesContaining(ast, '#compat-root').length);
  if (config.themes === 'all') {
    // Check names from daisyUI's own theme registry, including additions in upgrades.
    for (const name of Object.keys(daisyThemes))
      assert.ok(rulesContaining(ast, `[data-theme=${name}]`).length, name);
  }
  if (config.custom) {
    assert.ok(rulesContaining(ast, '[data-theme=compat-brand]').length);
    for (const [prop, value] of Object.entries({
      '--color-primary': '#123456',
      '--radius-field': '1.5rem',
      '--border': '3px',
      '--depth': '0',
      '--noise': '1',
    })) {
      assert.ok(hasDeclaration(ast, prop, value), `${config.name}: ${prop}`);
    }
  }
  if (!config.include && !config.exclude) {
    assert.ok(result.css.includes(prefix + 'drawer-toggle'), `${config.name}: drawer variants`);
    assert.ok(rulesContaining(ast, selector(tw(`${prefix}is-drawer-open:text-success`))).length);
  }

  if (!config.include && !config.exclude) {
    for (const name of actionClasses)
      assert.ok(rulesContaining(ast, selector(daisy(name))).length, `${config.name}: ${name}`);
    if (config.themes !== 'false')
      assert.ok(
        result.css.includes(prefix + 'theme-controller'),
        `${config.name}: native theme selector`,
      );
  }

  if ((!config.include || config.name === 'include-data-inputs') && !config.exclude) {
    for (const name of dataInputClasses)
      assert.ok(rulesContaining(ast, selector(daisy(name))).length, `${config.name}: ${name}`);
    for (const name of calendarParts)
      assert.ok(
        rulesContaining(ast, selector(tw(name))).length,
        `${config.name}: unprefixed calendar part ${name}`,
      );
    assert.ok(
      rulesContaining(libraryStyles, '.dsy-calendar .rdp-chevron').some((rule) => {
        if (!hasDeclaration(rule, 'fill', 'none')) return false;
        for (let parent = rule.parent; parent; parent = parent.parent)
          if (
            parent.type === 'atrule' &&
            parent.name === 'layer' &&
            parent.params === 'ngx-daisy-control-icons'
          )
            return true;
        return false;
      }),
      `${config.name}: Lucide calendar chevrons stay unfilled above daisyUI's icon fill layer`,
    );
  }

  if ((!config.include || config.name === 'include-data-display') && !config.exclude) {
    for (const name of dataDisplayClasses)
      assert.ok(rulesContaining(ast, selector(daisy(name))).length, `${config.name}: ${name}`);
  }

  if ((!config.include || config.name === 'include-remaining') && !config.exclude) {
    for (const name of remainingClasses)
      assert.ok(rulesContaining(ast, selector(daisy(name))).length, `${config.name}: ${name}`);
  }

  assert.ok(
    styles.includes('dsy-tabs > .dsy-tab-panel'),
    'Tab panel layout must use its stable host class, including bound directive inputs.',
  );
  // Real compiled library styles are appended after the app CSS, just as Angular injects them.
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>daisyUI compatibility: ${config.name}</title>
    <style>${result.css}</style><style>${styles}</style></head><body>
    <div id="compat-root" ${config.custom ? 'data-theme="compat-brand"' : ''} style="padding:24px">
      <h1>${config.name}</h1>
      <span id="success-reference" class="${tw('text-success')}">Success reference</span>
      <span id="error-reference" class="${tw('text-error')}">Error reference</span>
      <button id="theme-button" class="${markup('btn')} ${markup('btn-primary')}">Themed button</button>
      <div data-theme="dark"><button id="nested-button" class="${markup('btn')} ${markup('btn-primary')}">Nested dark theme</button></div>
      <dsy-icon id="utility-icon" class="dsy-icon ${tw('text-xl')} ${tw('w-10')} ${tw('text-error')}" style="--dsy-icon-size:4rem"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg></dsy-icon>
      <dsy-loader class="dsy-loader" data-size="md"><span class="dsy-loader-visual" id="scaled-loader"></span></dsy-loader>
      <dsy-loader class="dsy-loader" data-size="md" data-variant="bar"><span class="dsy-loader-content"><span class="dsy-loader-visual"><span id="rounded-track" class="dsy-loader-bar-track"></span></span></span></dsy-loader>
      <dsy-drawer-container class="dsy-drawer-container ${markup('drawer')} ${markup('drawer-open')}" data-mode="side" data-opened="true" data-position="start">
        <input disabled hidden type="checkbox" checked class="dsy-drawer-toggle ${markup('drawer-toggle')}">
        <dsy-drawer-content id="drawer-content" class="dsy-drawer-content ${markup('drawer-content')}">Main content</dsy-drawer-content>
        <dsy-drawer id="side-drawer" class="dsy-drawer ${markup('drawer-side')}" data-mode="side" data-opened="true" data-position="start" style="--dsy-drawer-width:18rem">
          <button class="dsy-drawer-backdrop ${markup('drawer-overlay')}"></button>
          <div id="utility-panel" class="dsy-drawer-panel ${tw('bg-primary')} ${tw('text-primary-content')} ${tw('rounded-box')} ${tw('w-80')}"><span id="state-marker" class="${tw(`${prefix}is-drawer-open:text-success`)}">Open drawer variant</span></div>
        </dsy-drawer>
      </dsy-drawer-container>
      <dsy-drawer-container class="dsy-drawer-container ${markup('drawer')}" data-mode="over" data-opened="false">
        <input disabled hidden type="checkbox" class="dsy-drawer-toggle ${markup('drawer-toggle')}">
        <dsy-drawer class="dsy-drawer ${markup('drawer-side')}" data-mode="over" data-opened="false">
          <div class="dsy-drawer-panel"><span id="closed-state-marker" class="${tw(`${prefix}is-drawer-close:text-error`)}">Closed drawer variant</span></div>
        </dsy-drawer>
      </dsy-drawer-container>
      <div class="dsy-dropdown-panel ${markup('dropdown-content')} ${markup('menu')} ${tw('bg-primary')} ${tw('w-80')}" id="action-dropdown">Dropdown styling</div>
      <button class="dsy-swap-button ${markup('btn')} ${markup('swap')} ${markup('swap-active')} ${markup('swap-rotate')}" data-state="on" aria-pressed="true"><span class="dsy-swap-on ${markup('swap-on')}" id="swap-on">On</span><span class="dsy-swap-off ${markup('swap-off')}" id="swap-off">Off</span></button>
      <dsy-fab class="dsy-fab ${markup('fab')}" data-position="inline" data-opened="true" data-layout="vertical"><button class="dsy-fab-trigger ${markup('btn')}">Actions</button><div class="dsy-fab-actions"><button id="fab-action" class="dsy-fab-action ${markup('btn')}">Create</button></div></dsy-fab>
      <label for="data-input-example" class="${markup('label')}">Form input</label><input id="data-input-example" class="${markup('input')} ${markup('input-primary')} ${tw('w-80')}" value="Themed input">
      <label><input id="data-checkbox" type="checkbox" checked class="${markup('checkbox')} ${markup('checkbox-primary')}"> Themed checkbox</label>
      <div class="dsy-calendar"><div class="dsy-calendar-view ${markup('react-day-picker')}" id="calendar-theme">Angular calendar theme</div></div>
      <input type="checkbox" class="${prefix}theme-controller" value="dark" id="native-theme-controller" aria-label="Dark theme">
      <dsy-modal class="dsy-modal ${markup('modal')} ${markup('modal-open')}" data-opened="false" data-placement="middle"><button class="dsy-modal-backdrop ${markup('modal-backdrop')}"></button><div class="dsy-modal-panel ${markup('modal-box')} ${tw('bg-primary')} ${tw('w-80')}" id="action-modal">Modal styling</div></dsy-modal>
    </div></body></html>`;
  await writeFile(path.join(output, config.name + '.html'), html);
  console.log(`PASS daisyUI CSS: ${config.name}`);
}
console.log(`Verified ${cases.length} configurations; browser fixtures: .angular/daisyui-compat/`);
