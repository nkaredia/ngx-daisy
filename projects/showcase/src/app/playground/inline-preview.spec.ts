import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { providePlayground } from './provide-playground';
import { InlinePreview } from './inline-preview';
import { InlinePreviewShell } from './inline-preview-shell';
import { ButtonColorsExample } from '../button-demo/example/button-colors-example';
import type { Playground } from './playground.types';

@Component({
  selector: 'test-compact-counter',
  template: `<button (click)="clicks.update(increment)">Clicked {{ clicks() }}</button>`,
})
class CompactCounter {
  readonly clicks = signal(0);
  readonly increment = (value: number) => value + 1;
}
@Component({ selector: 'test-compact-preset', template: `<p>{{ values() }}</p>` })
class CompactPreset {
  readonly values = input('Example defaults');
}
@Component({
  imports: [InlinePreviewShell],
  template: `@for (preview of config.inlinePreviews; track $index) {
    <demo-inline-preview-shell [component]="preview.component" [title]="preview.title" />
  }`,
})
class Host {
  readonly config: Playground = {
    components: [],
    previews: [],
    inlinePreviews: [
      { title: 'First example', component: CompactCounter },
      { title: 'Second example', component: CompactCounter },
      { title: 'Preset example', component: CompactPreset },
    ],
  };
}

describe('InlinePreview', () => {
  it('renders compact examples without metadata registration, property controls or injected state', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('demo-inline-preview')).toHaveLength(3);
    const shells = [...root.querySelectorAll<HTMLElement>('.inline-preview-shell')];
    expect(shells.map((shell) => shell.querySelector('h3')?.textContent?.trim())).toEqual([
      'First example',
      'Second example',
      'Preset example',
    ]);
    const headingIds = shells.map((shell) => shell.getAttribute('aria-labelledby'));
    expect(new Set(headingIds).size).toBe(3);
    expect(
      shells.every(
        (shell) => shell.querySelector('h3')?.id === shell.getAttribute('aria-labelledby'),
      ),
    ).toBe(true);

    expect(root.querySelector('.playground-props')).toBeNull();
    expect(root.querySelector('.playground-toolbar')).toBeNull();
    const buttons = root.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click();
    await fixture.whenStable();
    expect(buttons[0].textContent).toBe('Clicked 1');
    expect(buttons[1].textContent).toBe('Clicked 0');
    expect(root.querySelector('p')?.textContent).toBe('Example defaults');
  });
  it('keeps example state and visible source when changing the presentation', async () => {
    TestBed.configureTestingModule({
      providers: providePlayground({
        components: [],
        previews: [],
        exampleSources: [
          {
            component: CompactCounter,
            files: [
              { path: 'counter.html', language: 'html', content: '<button>Counter</button>' },
            ],
          },
        ],
      }),
    });
    const fixture = TestBed.createComponent(InlinePreviewShell);
    fixture.componentRef.setInput('component', CompactCounter);
    fixture.componentRef.setInput('title', 'Counter');
    fixture.componentRef.setInput('presentation', 'framed');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const button = root.querySelector<HTMLButtonElement>('demo-inline-preview button')!;
    button.click();
    await fixture.whenStable();
    fixture.componentRef.setInput('presentation', 'split');
    await fixture.whenStable();
    expect(root.querySelector('demo-inline-preview button')).toBe(button);
    expect(button.textContent).toBe('Clicked 1');
    expect(root.querySelector('.inline-preview-shell-split')).not.toBeNull();
    expect(root.querySelector('.inline-preview-stage')).not.toBeNull();
    expect(root.querySelector('.example-code-panel-header-copy')).not.toBeNull();
    expect(root.querySelector('.example-code-file-header')?.textContent).toContain('HTML');
    expect(root.querySelector('.inline-preview-source pre code')?.textContent).toBe(
      '<button>Counter</button>',
    );
    expect(root.querySelector('[aria-label="Show code"]')).toBeNull();
  });
  it('renders the actual colors example without a showcase heading, section or card', async () => {
    const fixture = TestBed.createComponent(InlinePreview);
    fixture.componentRef.setInput('component', ButtonColorsExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('button')).toHaveLength(8);
    expect(root.querySelector('h3, section, .inline-preview-shell')).toBeNull();
  });
});

describe('inline example source', () => {
  it('always shows HTML, with supporting TypeScript only when requested', async () => {
    TestBed.configureTestingModule({
      providers: providePlayground({
        components: [],
        previews: [],
        exampleSources: [
          {
            component: CompactPreset,
            files: [
              { path: 'example.ts', language: 'typescript', content: 'export class Example {}' },
              { path: 'example.html', language: 'html', content: '<button>Example</button>' },
              { path: 'example.scss', language: 'scss', content: ':host { display: block; }' },
            ],
          },
        ],
      }),
    });
    const fixture = TestBed.createComponent(InlinePreviewShell);
    fixture.componentRef.setInput('component', CompactPreset);
    fixture.componentRef.setInput('title', 'Example');
    fixture.componentRef.setInput('description', 'Start with native behavior.');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.inline-preview-description')?.textContent).toBe(
      'Start with native behavior.',
    );
    expect(root.querySelectorAll('[role="tab"]')).toHaveLength(1);
    expect(root.querySelector('code')?.textContent).toBe('<button>Example</button>');
    expect(root.querySelector('[aria-label="Show code"]')).toBeNull();
    expect(root.querySelector('[aria-label="Hide code"]')).toBeNull();
    expect(root.querySelector('[aria-label="Copy example.html"]')).not.toBeNull();
    fixture.componentRef.setInput('showTypescript', true);
    await fixture.whenStable();
    expect(root.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(root.querySelector('[role="tab"]')?.textContent).toContain('example.html');
    expect(root.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toContain(
      'example.html',
    );
    expect(root.querySelector('code')?.textContent).toBe('<button>Example</button>');
  });
});
