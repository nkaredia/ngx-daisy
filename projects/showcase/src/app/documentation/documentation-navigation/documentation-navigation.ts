import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { DocumentationSection } from '../documentation.types';

@Component({
  selector: 'demo-documentation-navigation',
  templateUrl: './documentation-navigation.html',
  styleUrl: './documentation-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocumentationNavigation {
  readonly sections = input.required<readonly DocumentationSection[]>();
  readonly contentRoot = input.required<HTMLElement>();
  readonly label = input('Documentation sections');
  private readonly location = inject(Location);

  sectionHref(id: string) {
    return this.location.prepareExternalUrl(`${this.location.path()}#${id}`);
  }

  scrollToSection(event: MouseEvent, id: string) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    const target = Array.from(this.contentRoot().querySelectorAll<HTMLElement>('[id]')).find(
      (element) => element.id === id,
    );
    if (!target) return;
    event.preventDefault();
    const reducedMotion = target.ownerDocument.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.location.replaceState(`${this.location.path()}#${id}`);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  }
}
