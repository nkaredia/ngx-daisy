import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-hero, [dsyHero]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyHero {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['hero', ''].filter(Boolean)));
}
@Component({
  selector: 'dsy-hero-content, [dsyHeroContent]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyHeroContent {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['hero-content', ''].filter(Boolean)));
}
@Directive({ selector: '[dsyHeroOverlay]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyHeroOverlay {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['hero-overlay', ''].filter(Boolean)));
}
