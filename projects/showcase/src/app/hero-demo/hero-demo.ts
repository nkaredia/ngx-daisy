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
import { DsyHero, DsyHeroContent, DsyHeroOverlay } from 'ngx-daisy/hero';

@Component({
  selector: 'demo-hero-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyHero, DsyHeroContent, DsyHeroOverlay],
  templateUrl: './hero-demo.html',
  styleUrl: './hero-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeroDemo {
  readonly playground = playground;
}
