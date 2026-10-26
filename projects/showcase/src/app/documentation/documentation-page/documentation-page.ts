import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { DocumentationNavigation } from '../documentation-navigation/documentation-navigation';
import { DocumentationSection } from '../documentation.types';

@Component({
  selector: 'demo-documentation-page',
  imports: [DocumentationNavigation],
  templateUrl: './documentation-page.html',
  styleUrl: './documentation-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocumentationPage {
  readonly sections = input.required<readonly DocumentationSection[]>();
  readonly navigationLabel = input('Documentation sections');
}
