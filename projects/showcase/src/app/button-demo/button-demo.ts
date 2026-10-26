import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { DocumentationSection } from '../documentation/documentation.types';
import { ButtonDocumentation } from './button-documentation';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { InlinePreviewShell } from '../playground/inline-preview-shell';
import { providePlayground } from '../playground/provide-playground';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Playground, InlinePreviewShell, ButtonDocumentation, DocumentationPage],
  providers: providePlayground(playground),
  selector: 'demo-button-demo',
  styleUrl: './button-demo.scss',
  templateUrl: './button-demo.html',
})
export class ButtonDemo {
  readonly playground = playground;
  readonly sections: readonly DocumentationSection[] = [
    { id: 'button-playground', label: 'Playground' },
    { id: 'button-examples', label: 'UI examples' },
    { id: 'button-angular', label: 'Angular usage' },
    { id: 'button-styling', label: 'Styling' },
    { id: 'button-api', label: 'API' },
    { id: 'button-accessibility', label: 'Accessibility' },
  ];
}
