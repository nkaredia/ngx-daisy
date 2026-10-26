import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DocumentationPage } from './documentation-page';
import { DocumentationNavigation } from '../documentation-navigation/documentation-navigation';
import { DocumentationSection } from '../documentation.types';

@Component({
  imports: [DocumentationPage],
  template: `
    <section id="outside-section">Outside this documentation page</section>
    <demo-documentation-page [sections]="sections" navigationLabel="Example documentation">
      <h2>Example component</h2>
      <section id="example:usage" tabindex="0">Projected usage content</section>
    </demo-documentation-page>
  `,
})
class DocumentationHost {
  readonly sections: readonly DocumentationSection[] = [
    { id: 'example:usage', label: 'Usage' },
    { id: 'outside-section', label: 'Unavailable section' },
  ];
}

describe('DocumentationPage', () => {
  it('renders arbitrary page sections and scrolls only within its projected content', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(DocumentationHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const navigation = fixture.debugElement.query(By.directive(DocumentationNavigation))
      .componentInstance as DocumentationNavigation;
    const target = root.querySelector<HTMLElement>('[id="example:usage"]')!;
    target.scrollIntoView = vi.fn();
    const media = vi.fn(() => ({ matches: false }));
    vi.stubGlobal('matchMedia', media);
    try {
      expect(root.querySelector('nav')?.getAttribute('aria-label')).toBe('Example documentation');
      expect(
        Array.from(root.querySelectorAll('nav a'), (link) => link.textContent?.trim()),
      ).toEqual(['Usage', 'Unavailable section']);
      const event = new MouseEvent('click', { cancelable: true });
      navigation.scrollToSection(event, 'example:usage');
      expect(event.defaultPrevented).toBe(true);
      expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(document.activeElement).toBe(target);
      expect(target.getAttribute('tabindex')).toBe('0');
      const outside = new MouseEvent('click', { cancelable: true });
      navigation.scrollToSection(outside, 'outside-section');
      expect(outside.defaultPrevented).toBe(false);
      const modified = new MouseEvent('click', { cancelable: true, ctrlKey: true });
      navigation.scrollToSection(modified, 'example:usage');
      expect(modified.defaultPrevented).toBe(false);
      expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('does not reserve a sidebar for a page without section links', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(DocumentationPage);
    fixture.componentRef.setInput('sections', []);
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('demo-documentation-navigation'),
    ).toBeNull();
  });
});
