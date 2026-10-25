import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DsyTooltip } from '@ngx-daisy/cdk/tooltip';
import { Playground } from './playground.component';
import { providePlayground } from './provide-playground';
import type {
  Playground as PlaygroundConfig,
  PlaygroundProperty,
  PlaygroundValues,
} from './playground.types';

class Example {}
function property(
  name: string,
  action: PlaygroundProperty['action'],
  extra: Partial<PlaygroundProperty> = {},
): PlaygroundProperty {
  return {
    name,
    property: name,
    kind: 'input',
    type: 'string',
    required: false,
    optional: false,
    nullable: false,
    action,
    ...extra,
  };
}
@Component({
  selector: 'test-example-preview',
  template: `<p data-preview>
      {{ values()[0]?.['variant'] }} / {{ values()[0]?.['disabled'] }} /
      {{ values()[0]?.['tabIndex'] }} / {{ values()[0]?.['title'] }}
    </p>
    <button data-local (click)="clicks.update(increment)">Clicks {{ clicks() }}</button>`,
})
class ExamplePreview {
  readonly clicks = signal(0);
  readonly increment = (value: number) => value + 1;
  readonly values = input<PlaygroundValues>([]);
}
@Component({
  selector: 'test-alternate-preview',
  template: `<p data-preview>Alternate {{ values()[0]?.['variant'] }}</p>`,
})
class AlternatePreview extends ExamplePreview {}
@Component({
  selector: 'test-compound-preview',
  template: `<p data-preview>Compound {{ values()[1]?.['variant'] }}</p>`,
})
class CompoundPreview extends ExamplePreview {}
@Component({ selector: 'test-empty-preview', template: `<p data-preview>Empty</p>` })
class EmptyPreview extends ExamplePreview {}
const config: PlaygroundConfig = {
  previews: [ExamplePreview, AlternatePreview],
  components: [
    {
      class: Example,
      props: [
        property(
          'variant',
          { kind: 'select', options: ['solid', 'outline'] },
          { default: 'solid' },
        ),
        property(
          'disabled',
          { kind: 'toggle', options: [false, true] },
          { type: 'boolean', default: false },
        ),
        property(
          'tabindex',
          { kind: 'number' },
          { property: 'tabIndex', type: 'number | undefined', optional: true },
        ),
        property('title', { kind: 'text' }, { default: 'Hello' }),
        property(
          'amount',
          { kind: 'number' },
          { type: 'number | null', nullable: true, default: 2 },
        ),
        property('data', { kind: 'unsupported', reason: 'Requires a specialized editor.' }),
        property('level', { kind: 'select', options: [1, 2] }, { type: '1 | 2', default: 2 }),
      ],
    },
  ],
};

const compoundConfig: PlaygroundConfig = {
  previews: [CompoundPreview],
  components: [config.components[0], config.components[0]],
};
const emptyConfig: PlaygroundConfig = {
  previews: [EmptyPreview],
  components: [{ class: Example }],
};

@Component({
  imports: [Playground],
  providers: providePlayground(config, compoundConfig, emptyConfig),
  template: `<demo-playground
      data-primary
      [component]="selected()"
      [(propsPosition)]="position"
      (valuesChange)="lastValues = $event"
    />
    <demo-playground data-secondary [component]="other" />`,
})
class Host {
  readonly selected = signal(ExamplePreview);
  readonly other = AlternatePreview;
  readonly position = signal<'side' | 'bottom'>('side');
  lastValues: PlaygroundValues = [];
}

async function create() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  return fixture;
}

function change(element: HTMLInputElement | HTMLSelectElement, value: string) {
  element.value = value;
  element.dispatchEvent(
    new Event(element instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }),
  );
}

describe('Playground', () => {
  it('selects a non-first literal default and preserves numeric option types through editing and Reset', async () => {
    const fixture = await create();
    const root: HTMLElement = fixture.nativeElement;
    const select = root.querySelector<HTMLSelectElement>(
      '[data-primary] select[aria-label="level"]',
    )!;
    expect(select.value).toBe('1');
    expect(select.selectedOptions[0].textContent).toBe('2');
    change(select, '0');
    await fixture.whenStable();
    expect(fixture.componentInstance.lastValues[0]['level']).toBe(1);
    root.querySelector<HTMLButtonElement>('[data-primary] [aria-label="Reset"]')!.click();
    await fixture.whenStable();
    expect(select.value).toBe('1');
    expect(fixture.componentInstance.lastValues[0]['level']).toBe(2);
  });

  it('keeps local preview state during edits and placement changes, then restores it on Reset', async () => {
    const fixture = await create();
    const root: HTMLElement = fixture.nativeElement;
    const primary = root.querySelector<HTMLElement>('[data-primary]')!;
    const secondary = root.querySelector<HTMLElement>('[data-secondary]')!;
    const local = primary.querySelector<HTMLButtonElement>('[data-local]')!;
    const secondaryPreview = secondary.querySelector('[data-preview]');
    local.click();
    change(primary.querySelector<HTMLInputElement>('input[aria-label="title"]')!, 'Updated');
    await fixture.whenStable();
    primary.querySelector<HTMLButtonElement>('[aria-label="Properties below preview"]')!.click();
    await fixture.whenStable();
    expect(primary.querySelector('[data-local]')).toBe(local);
    expect(local.textContent).toBe('Clicks 1');
    expect(secondary.querySelector('[data-preview]')).toBe(secondaryPreview);
    primary.querySelector<HTMLButtonElement>('[aria-label="Reset"]')!.click();
    await fixture.whenStable();
    expect(primary.querySelector('[data-local]')).not.toBe(local);
    expect(primary.querySelector('[data-local]')?.textContent).toBe('Clicks 0');
    expect(primary.querySelector('[data-preview]')?.textContent).toContain('Hello');
    expect(fixture.componentInstance.position()).toBe('bottom');
  });

  it('switches panel position without discarding selected properties and resets to defaults', async () => {
    const fixture = await create();
    const root: HTMLElement = fixture.nativeElement;
    change(root.querySelector('select[aria-label="variant"]')!, '1');
    await fixture.whenStable();
    expect(root.querySelector('[data-preview]')?.textContent).toContain('outline');
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('.playground-toolbar button')];
    buttons
      .find((button) => button.getAttribute('aria-label') === 'Properties below preview')!
      .click();
    await fixture.whenStable();
    expect(fixture.componentInstance.position()).toBe('bottom');
    const placement = root.querySelector<HTMLButtonElement>(
      '[aria-label="Properties below preview"]',
    )!;
    expect(placement.getAttribute('aria-pressed')).toBe('true');
    expect(placement.querySelector('svg')).not.toBeNull();
    const tooltip = fixture.debugElement
      .queryAll(By.directive(DsyTooltip))
      .find((el) => el.nativeElement === placement)!
      .injector.get(DsyTooltip);
    expect(tooltip.text()).toBe('Show on the side');
    placement.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.position()).toBe('side');
    expect(placement.getAttribute('aria-pressed')).toBe('false');
    expect(tooltip.text()).toBe('Show below');
    placement.click();
    await fixture.whenStable();
    expect(root.querySelector('.playground-shell')?.getAttribute('data-props-position')).toBe(
      'bottom',
    );
    expect(root.querySelector('[data-preview]')?.textContent).toContain('outline');
    buttons.find((button) => button.getAttribute('aria-label') === 'Reset')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.lastValues[0]['variant']).toBe('solid');
    expect(root.querySelector('[data-preview]')?.textContent).toContain('solid');
  });

  it('preserves boolean, numeric and string types, uses member names for aliased properties and supports unset/null', async () => {
    const fixture = await create();
    const root: HTMLElement = fixture.nativeElement;
    const toggle = root.querySelector<HTMLInputElement>('input[aria-label="disabled"]')!;
    toggle.click();
    change(root.querySelector('input[aria-label="tabindex"]')!, '0');
    change(root.querySelector('input[aria-label="title"]')!, 'Updated');
    await fixture.whenStable();
    expect(fixture.componentInstance.lastValues[0]['disabled']).toBe(true);
    expect(fixture.componentInstance.lastValues[0]['tabIndex']).toBe(0);
    expect(fixture.componentInstance.lastValues[0]['title']).toBe('Updated');
    root.querySelector<HTMLButtonElement>('[aria-label="Unset tabindex"]')!.click();
    root.querySelector<HTMLButtonElement>('[aria-label="Set amount to null"]')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.lastValues[0]['tabIndex']).toBeUndefined();
    expect(fixture.componentInstance.lastValues[0]['amount']).toBeNull();
    expect(root.textContent).toContain('Requires a specialized editor.');
  });

  it('renders exactly one preview per instance and keeps edits and reset independent', async () => {
    const fixture = await create();
    const primary: HTMLElement = fixture.nativeElement.querySelector('[data-primary]');
    const secondary: HTMLElement = fixture.nativeElement.querySelector('[data-secondary]');
    expect(primary.querySelectorAll('.playground-example').length).toBe(1);
    expect(secondary.querySelectorAll('.playground-example').length).toBe(1);
    change(primary.querySelector('select[aria-label="variant"]')!, '1');
    await fixture.whenStable();
    expect(primary.querySelector('[data-preview]')?.textContent).toContain('outline');
    expect(secondary.querySelector('[data-preview]')?.textContent).toContain('solid');
    change(secondary.querySelector('select[aria-label="variant"]')!, '1');
    primary.querySelector<HTMLButtonElement>('.playground-toolbar [aria-label="Reset"]')!.click();
    await fixture.whenStable();
    expect(primary.querySelector('[data-preview]')?.textContent).toContain('solid');
    expect(secondary.querySelector('[data-preview]')?.textContent).toContain('outline');
    expect(primary.querySelector('select')?.id).not.toBe(secondary.querySelector('select')?.id);
  });

  it('supports compound input groups in one preview and resets values when the preview class changes', async () => {
    const fixture = await create();
    fixture.componentInstance.selected.set(CompoundPreview);
    await fixture.whenStable();
    const primary: HTMLElement = fixture.nativeElement.querySelector('[data-primary]');
    const previews = fixture.debugElement.queryAll(By.directive(CompoundPreview));
    expect(previews.length).toBe(1);
    const selects = primary.querySelectorAll<HTMLSelectElement>('select[aria-label="variant"]');
    change(selects[1], '1');
    await fixture.whenStable();
    expect(fixture.componentInstance.lastValues[0]['variant']).toBe('solid');
    expect(fixture.componentInstance.lastValues[1]['variant']).toBe('outline');
    expect((previews[0].componentInstance as CompoundPreview).values().length).toBe(2);
    fixture.componentInstance.selected.set(ExamplePreview);
    await fixture.whenStable();
    expect(primary.querySelector('[data-preview]')?.textContent).toContain('solid');
    fixture.componentInstance.selected.set(EmptyPreview);
    await fixture.whenStable();
    expect(primary.textContent).toContain('No properties to configure.');
  });
});

describe('playground source titlebar', () => {
  it('opens code above the preview only from the titlebar code button', async () => {
    TestBed.configureTestingModule({
      providers: providePlayground({
        ...config,
        exampleSources: [
          {
            component: ExamplePreview,
            files: [
              { path: 'example.ts', language: 'typescript', content: 'const example = true;' },
            ],
          },
        ],
      }),
    });
    const fixture = TestBed.createComponent(Playground);
    fixture.componentRef.setInput('component', ExamplePreview);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const toolbar = root.querySelector<HTMLElement>('.playground-toolbar')!;
    for (const button of toolbar.querySelectorAll('button')) {
      expect(button.classList.contains('btn-circle')).toBe(true);
      expect(button.getAttribute('aria-label')).toBeTruthy();
      expect(button.querySelector('svg')).not.toBeNull();
      expect(
        fixture.debugElement
          .queryAll(By.directive(DsyTooltip))
          .some((element) => element.nativeElement === button),
      ).toBe(true);
    }
    toolbar.click();
    await fixture.whenStable();
    expect(root.querySelector('pre')).toBeNull();
    const toggle = toolbar.querySelector<HTMLButtonElement>('.dsy-collapse-trigger')!;
    expect(toggle.getAttribute('aria-label')).toBe('Show code');
    toggle.click();
    await fixture.whenStable();
    expect(root.querySelector('code')?.textContent).toBe('const example = true;');
    const source = root.querySelector('demo-example-code')!;
    const preview = root.querySelector('.playground-layout')!;
    expect(source.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    toolbar.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    await fixture.whenStable();
    expect(root.querySelector('pre')).toBeNull();
  });
});
