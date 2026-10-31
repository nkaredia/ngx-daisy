import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
/** A noninteractive surface. Compose explicit buttons/links for its actions. */
@Component({
  selector: 'StackLayout[dsyCard]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyCard {
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly border = input<'none' | 'solid'>('none');
  readonly classes = computed(
    () => `dsy-native-card dsy-native-card-${this.size()} dsy-native-card-border-${this.border()}`,
  );
}
@Component({
  selector: 'StackLayout[dsyCardBody]',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'dsy-native-card-body' },
})
export class DsyCardBody {}
@Directive({
  selector: 'Label[dsyCardTitle]',
  standalone: true,
  host: { class: 'dsy-native-card-title', textWrap: 'true', accessibilityRole: 'header' },
})
export class DsyCardTitle {}
@Component({
  selector: 'FlexboxLayout[dsyCardActions]',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'dsy-native-card-actions' },
})
export class DsyCardActions {}
