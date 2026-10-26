import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './radial-progress-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyRadialProgress } from '@ngx-daisy/cdk/radial-progress';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-radial-progress-demo',
  imports: [DocumentationPage, ComponentDocumentation, Playground, DsyRadialProgress],
  templateUrl: './radial-progress-demo.html',
  styleUrl: './radial-progress-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RadialProgressDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly value = signal(72);
}
