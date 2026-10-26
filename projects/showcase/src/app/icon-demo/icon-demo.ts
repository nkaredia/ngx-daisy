import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './icon-documentation.code';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { LucideHouse, LucideCheck } from '@lucide/angular';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyIcon, type DsyIconColor } from '@ngx-daisy/cdk/icon';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: providePlayground(playground),
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyButton,
    DsyIcon,
    LucideHouse,
    LucideCheck,
  ],
  selector: 'demo-icon-demo',
  styleUrl: './icon-demo.scss',
  templateUrl: './icon-demo.html',
})
export class IconDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly iconColor = signal<DsyIconColor>('primary');
  readonly iconColors: readonly DsyIconColor[] = [
    'inherit',
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ];

  setIconColor(value: string) {
    const color = this.iconColors.find((color) => color === value);
    if (color) this.iconColor.set(color);
  }
}
