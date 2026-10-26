import {
  ElementRef,
  inject,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { ButtonDocumentation } from './button-documentation';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { InlinePreviewShell } from '../playground/inline-preview-shell';
import { providePlayground } from '../playground/provide-playground';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Playground, InlinePreviewShell, ButtonDocumentation],
  providers: providePlayground(playground),
  selector: 'demo-button-demo',
  styleUrl: './button-demo.scss',
  templateUrl: './button-demo.html',
})
export class ButtonDemo {
  readonly playground = playground;
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly location = inject(Location);
  readonly sections = [
    { id: 'button-playground', label: 'Playground' },
    { id: 'button-examples', label: 'UI examples' },
    { id: 'button-angular', label: 'Angular usage' },
    { id: 'button-styling', label: 'Styling' },
    { id: 'button-api', label: 'API' },
    { id: 'button-accessibility', label: 'Accessibility' },
  ];

  sectionHref(id: string) {
    return this.location.prepareExternalUrl(`${this.location.path()}#${id}`);
  }

  scrollToSection(event: MouseEvent, id: string) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    const target = this.element.nativeElement.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    event.preventDefault();
    const reducedMotion = target.ownerDocument.defaultView?.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.location.replaceState(`${this.location.path()}#${id}`);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  }
}
