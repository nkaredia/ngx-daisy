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
import { DsyCarousel, DsyCarouselItem } from '@ngx-daisy/cdk/carousel';

@Component({
  selector: 'demo-carousel-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyCarousel, DsyCarouselItem],
  templateUrl: './carousel-demo.html',
  styleUrl: './carousel-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CarouselDemo {
  readonly playground = playground;
  readonly slide = signal(0);
  readonly loop = signal(false);
}
