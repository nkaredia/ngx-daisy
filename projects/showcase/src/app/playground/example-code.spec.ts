import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { ExampleCode } from './example-code';
import type { PlaygroundSourceFile } from './playground.types';

const files: readonly PlaygroundSourceFile[] = [
  {
    path: 'example.ts',
    language: 'typescript',
    content: '// exact source\r\nconst value = 1;\r\n',
    tokens: [
      { content: '// exact source', color: 'light-dark(#6A737D, #6A737D)', fontStyle: 1 },
      { content: '\r\n' },
      { content: 'const', color: 'light-dark(#D73A49, #F97583)', fontStyle: 2 },
      { content: ' value = 1;\r\n' },
    ],
  },
  {
    path: 'example.html',
    language: 'html',
    content: '<img src="missing" onerror="alert(1)">\n<button>Example</button>\n',
  },
  { path: 'example.scss', language: 'scss', content: ':host { display: block; }\n' },
];

describe('ExampleCode', () => {
  it('shows authored files as inert text, supports keyboard tabs, and copies the exact active source', async () => {
    const copy = vi.fn(() => true);
    TestBed.configureTestingModule({ providers: [{ provide: Clipboard, useValue: { copy } }] });
    const fixture = TestBed.createComponent(ExampleCode);
    fixture.componentRef.setInput('files', files);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const toggle = root.querySelector<HTMLButtonElement>('button')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('pre')).toBeNull();
    toggle.click();
    await fixture.whenStable();
    const tabs = root.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs).toHaveLength(3);
    expect(root.querySelector('.example-code-toolbar [aria-label^="Copy"]')).toBeNull();
    const panels = root.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels).toHaveLength(3);
    panels.forEach((panel, index) => {
      const button = panel.querySelector<HTMLButtonElement>('.example-code-copy')!;
      expect(button.getAttribute('aria-label')).toBe('Copy ' + files[index].path);
      expect(panel.querySelectorAll('.example-code-copy')).toHaveLength(1);
    });
    panels[0].querySelector<HTMLButtonElement>('.example-code-copy')!.click();
    await fixture.whenStable();
    expect(copy).toHaveBeenLastCalledWith(files[0].content);
    expect(root.querySelector('code')?.textContent).toBe(files[0].content);
    expect(root.querySelector('code span')?.getAttribute('style')).toContain('light-dark(');
    expect(root.querySelector<HTMLElement>('code span')?.style.fontStyle).toBe('italic');
    tabs[1].click();
    await fixture.whenStable();
    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('[role="tabpanel"]:not([hidden]) code')?.textContent).toBe(
      files[1].content,
    );
    root.querySelector<HTMLButtonElement>('[aria-label="Copy example.html"]')!.click();
    await fixture.whenStable();
    expect(copy).toHaveBeenLastCalledWith(files[1].content);
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Copied.');
    tabs[1].focus();
    tabs[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', keyCode: 39, bubbles: true }),
    );
    await fixture.whenStable();
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(root.querySelector('[role="status"]')?.textContent).toBe('');
    copy.mockReturnValue(false);
    root.querySelector<HTMLButtonElement>('[aria-label="Copy example.scss"]')!.click();
    await fixture.whenStable();
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Copy failed.');
    toggle.click();
    await fixture.whenStable();
    expect(root.querySelector('pre')).toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
