import { LucideArrowRight } from '@lucide/angular';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { DsyHero, DsyHeroContent, DsyHeroOverlay } from '@ngx-daisy/cdk/hero';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'demo-hero-example',
  standalone: true,
  imports: [LucideArrowRight, DsyHero, DsyHeroContent, DsyHeroOverlay, DsyButton],
  templateUrl: './hero-example.html',
  styleUrl: './hero-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeroExample {
  readonly values = input<
    readonly [Record<string, never>?, Record<string, never>?, Record<string, never>?]
  >([]);
}
