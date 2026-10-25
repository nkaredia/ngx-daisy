import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';

@Component({
  selector: 'demo-button-sizes-example',
  imports: [DsyButton],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <button dsyButton size="xs" color="primary">xs</button>
      <button dsyButton size="sm" color="primary">sm</button>
      <button dsyButton size="md" color="primary">md</button>
      <button dsyButton size="lg" color="primary">lg</button>
      <button dsyButton size="xl" color="primary">xl</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonSizesExample {}
