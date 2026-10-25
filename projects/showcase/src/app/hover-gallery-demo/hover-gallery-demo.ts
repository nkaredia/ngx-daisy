import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
} from '@angular/core';
import { DsyHoverGallery } from '@ngx-daisy/cdk/hover-gallery';

@Component({
  selector: 'demo-hover-gallery-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyHoverGallery],
  templateUrl: './hover-gallery-demo.html',
  styleUrl: './hover-gallery-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HoverGalleryDemo {
  readonly playground = playground;
  readonly selected = signal(0);
  readonly images = [
    { src: '/display/mountain.svg', alt: 'Alpine landscape' },
    { src: '/display/coast.svg', alt: 'Coastal landscape' },
    { src: '/display/desert.svg', alt: 'Desert landscape' },
  ];
}
