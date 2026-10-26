import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './mockup-phone-documentation.code';
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
import { DsyMockupPhone } from '@ngx-daisy/cdk/mockup-phone';

@Component({
  selector: 'demo-mockup-phone-demo',
  providers: providePlayground(playground),
  imports: [DocumentationPage, ComponentDocumentation, Playground, DsyMockupPhone],
  templateUrl: './mockup-phone-demo.html',
  styleUrl: './mockup-phone-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupPhoneDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly saved = signal(false);
  readonly toggle = (v: boolean) => !v;
}
