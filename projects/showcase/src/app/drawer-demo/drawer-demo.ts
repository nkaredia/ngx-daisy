import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './drawer-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyDrawer, DsyDrawerContainer, DsyDrawerContent } from '@ngx-daisy/cdk/drawer';

@Component({
  selector: 'demo-drawer-demo',
  standalone: true,
  providers: providePlayground(playground),
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    DsyButton,
    DsyDrawerContainer,
    DsyDrawerContent,
    DsyDrawer,
  ],
  templateUrl: './drawer-demo.html',
  styleUrl: './drawer-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DrawerDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly mode = signal<'over' | 'side'>('side');
  readonly position = signal<'start' | 'end'>('start');
  readonly opened = signal(true);
  readonly currentSection = signal('Overview');
  readonly modes = ['side', 'over'] as const;
  readonly positions = ['start', 'end'] as const;
  readonly sections = ['Overview', 'Projects', 'Activity'] as const;

  setMode(value: string) {
    const mode = this.modes.find((mode) => mode === value);
    if (mode) {
      this.opened.set(false);
      this.mode.set(mode);
    }
  }

  setPosition(value: string) {
    const position = this.positions.find((position) => position === value);
    if (position) {
      this.opened.set(false);
      this.position.set(position);
    }
  }

  selectSection(section: string) {
    const selected = this.sections.find((item) => item === section);
    if (selected) {
      this.currentSection.set(selected);
      if (this.mode() === 'over') this.opened.set(false);
    }
  }
}
