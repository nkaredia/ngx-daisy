import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-card, [dsyCard]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyCard {
  private readonly daisy = injectDaisyUIClasses();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly border = input<'none' | 'solid' | 'dash'>('none');
  readonly side = input(false, { transform: booleanAttribute });
  readonly imageFull = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      'card',
      { xs: 'card-xs', sm: 'card-sm', md: 'card-md', lg: 'card-lg', xl: 'card-xl' }[this.size()],
      { none: '', solid: 'card-border', dash: 'card-dash' }[this.border()],
      this.side() ? 'card-side' : '',
      this.imageFull() ? 'image-full' : '',
    ),
  );
}
@Component({
  selector: 'dsy-card-body, [dsyCardBody]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyCardBody {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('card-body', ''));
}
@Directive({
  selector: '[dsyCardTitle]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyCardTitle {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('card-title', ''));
}
@Component({
  selector: 'dsy-card-actions, [dsyCardActions]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyCardActions {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('card-actions', ''));
}
