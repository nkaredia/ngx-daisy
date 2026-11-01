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
  readonly quickStart = playground.inlinePreviews?.[0];
  readonly variations = playground.inlinePreviews?.slice(1) ?? [];
  readonly variationDescriptions: Readonly<Record<string, string>> = {
    Basics:
      'Compare the default, filled and quieter treatments before choosing a visual hierarchy.',
    Colors: 'Use semantic intent for actions such as saving, confirming or deleting.',
    Sizes: 'Compare the existing size presets in the context of your application.',
    Variants: 'Change visual emphasis while keeping the same action and native behavior.',
    'Shapes, layouts and states':
      'See icon actions, navigation links, full-width layouts and pending work.',
  };
  readonly sections: readonly DocumentationSection[] = [
    { id: 'button-start', label: 'Get started' },
    { id: 'button-usage', label: 'Choose a control' },
    { id: 'button-playground', label: 'Playground' },
    { id: 'button-examples', label: 'UI examples' },
    { id: 'button-angular', label: 'Angular usage' },
    { id: 'button-styling', label: 'Styling' },
    { id: 'button-api', label: 'API' },
    { id: 'button-accessibility', label: 'Accessibility' },
  ];
}
