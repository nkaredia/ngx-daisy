import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-aura, [dsyAura]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyAura {
  private readonly daisy = injectDaisyUIClasses();
  readonly preset = input<'gold' | 'silver' | 'rainbow' | 'holo'>('gold');
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly dual = input(false, { transform: booleanAttribute });
  readonly glow = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      'aura',
      { gold: 'aura-gold', silver: 'aura-silver', rainbow: 'aura-rainbow', holo: 'aura-holo' }[
        this.preset()
      ],
      { xs: 'aura-xs', sm: 'aura-sm', md: 'aura-md', lg: 'aura-lg', xl: 'aura-xl' }[this.size()],
      this.dual() ? 'aura-dual' : '',
      this.glow() ? 'aura-glow' : '',
    ),
  );
}
