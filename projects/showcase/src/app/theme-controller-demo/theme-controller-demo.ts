import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DsyThemeController } from 'ngx-daisy/theme-controller';
import { DsyButton } from 'ngx-daisy/button';
@Component({
  selector: 'demo-theme-controller-demo',
  standalone: true,
  providers: providePlayground(playground),
  imports: [Playground, DsyThemeController, DsyButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './theme-controller-demo.html',
  styleUrl: './theme-controller-demo.scss',
})
export class ThemeControllerDemo {
  readonly playground = playground;
  readonly theme = signal('light');
  readonly themes = ['light', 'dark', 'cupcake', 'synthwave'];
}
