import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';

@Component({
  selector: 'demo-button-basics-example',
  imports: [DsyButton],
  template: `
    <div class="flex flex-wrap gap-3">
      <button dsyButton type="button">Default</button>
      <button dsyButton color="primary" type="button">Primary</button>
      <button dsyButton color="secondary" variant="outline" type="button">Outline</button>
      <button dsyButton color="success" variant="soft" type="button">Soft</button>
      <button dsyButton variant="ghost" type="button">Ghost</button>
      <button dsyButton disabled type="button">Disabled</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonBasicsExample {}
