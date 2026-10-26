import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './navbar-documentation.code';
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
import { DsyNavbar, DsyNavbarStart, DsyNavbarCenter, DsyNavbarEnd } from '@ngx-daisy/cdk/navbar';

@Component({
  selector: 'demo-navbar-demo',
  providers: providePlayground(playground),
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyNavbar,
    DsyNavbarStart,
    DsyNavbarCenter,
    DsyNavbarEnd,
  ],
  templateUrl: './navbar-demo.html',
  styleUrl: './navbar-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NavbarDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly signedIn = signal(false);
  readonly toggle = (v: boolean) => !v;
}
