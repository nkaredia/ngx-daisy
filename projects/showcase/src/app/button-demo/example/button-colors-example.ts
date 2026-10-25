import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';

@Component({
  selector: 'demo-button-colors-example',
  imports: [DsyButton],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <button dsyButton color="neutral">neutral</button>
      <button dsyButton color="primary">primary</button>
      <button dsyButton color="secondary">secondary</button>
      <button dsyButton color="accent">accent</button>
      <button dsyButton color="info">info</button>
      <button dsyButton color="success">success</button>
      <button dsyButton color="warning">warning</button>
      <button dsyButton color="error">error</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonColorsExample {}
