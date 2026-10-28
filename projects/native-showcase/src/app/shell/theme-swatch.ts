import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
} from '@angular/core';

/** Shared four-token theme signature, matching the web theme selector. */
@Component({
  selector: 'GridLayout[appThemeSwatch]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `<GridLayout
    rows="auto, auto"
    columns="auto, auto"
    class="bg-base-100 rounded-field p-1"
    accessible="false"
  >
    <Label width="5" height="5" margin="1" class="bg-base-content rounded-full"></Label>
    <Label col="1" width="5" height="5" margin="1" class="bg-primary rounded-full"></Label>
    <Label row="1" width="5" height="5" margin="1" class="bg-secondary rounded-full"></Label>
    <Label row="1" col="1" width="5" height="5" margin="1" class="bg-accent rounded-full"></Label>
  </GridLayout>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeThemeSwatch {}
