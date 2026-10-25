import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';

@Component({
  selector: 'demo-button-variants-example',
  imports: [DsyButton],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <button dsyButton variant="solid" color="secondary">solid</button>
      <button dsyButton variant="outline" color="secondary">outline</button>
      <button dsyButton variant="soft" color="secondary">soft</button>
      <button dsyButton variant="ghost" color="secondary">ghost</button>
      <button dsyButton variant="link" color="secondary">link</button>
      <button dsyButton variant="dash" color="secondary">dash</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonVariantsExample {}
