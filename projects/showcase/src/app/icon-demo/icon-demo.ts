import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { LucideHouse, LucideCheck } from '@lucide/angular';
import { DsyButton } from 'ngx-daisy/button';
import { DsyIcon, type DsyIconColor } from 'ngx-daisy/icon';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: providePlayground(playground),
  imports: [Playground, DsyButton, DsyIcon, LucideHouse, LucideCheck],
  selector: 'demo-icon-demo',
  styleUrl: './icon-demo.scss',
  templateUrl: './icon-demo.html',
})
export class IconDemo {
  readonly playground = playground;
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
