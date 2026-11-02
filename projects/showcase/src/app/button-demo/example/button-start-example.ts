import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'demo-button-start-example',
  imports: [DsyButton],
  template: `<button dsyButton type="button">Save changes</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonStartExample {}
