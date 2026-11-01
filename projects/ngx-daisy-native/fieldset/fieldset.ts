import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
/** A visual native group. Put group disabling/validation in the Angular schema. */
@Component({
  selector: 'StackLayout[dsyFieldset]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    @if (legend()) {
      <Label
        [text]="legend()"
        class="dsy-native-fieldset-legend"
        [class]="legendClass()"
        textWrap="true"
        accessibilityRole="header"
      ></Label>
    }
    @if (description()) {
      <Label [text]="description()" class="dsy-native-fieldset-description" textWrap="true"></Label>
    }
    <StackLayout [class]="bodyClass()"><ng-content /></StackLayout>
  `,
  styleUrl: './fieldset.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'dsy-native-fieldset', '[visibility]': 'hidden() ? "collapsed" : "visible"' },
})
export class DsyFieldset {
  readonly legend = input('');
  readonly description = input('');
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly legendClass = input('');
  readonly bodyClass = input('');
}
