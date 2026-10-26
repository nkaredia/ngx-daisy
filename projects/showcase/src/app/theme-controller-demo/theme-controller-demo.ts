import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './theme-controller-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DsyThemeController } from '@ngx-daisy/cdk/theme-controller';
import { DsyButton } from '@ngx-daisy/cdk/button';
@Component({
  selector: 'demo-theme-controller-demo',
  standalone: true,
  providers: providePlayground(playground),
  imports: [DocumentationPage, ComponentDocumentation, Playground, DsyThemeController, DsyButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './theme-controller-demo.html',
  styleUrl: './theme-controller-demo.scss',
})
export class ThemeControllerDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly theme = signal('light');
  readonly themes = ['light', 'dark', 'cupcake', 'synthwave'];
}
