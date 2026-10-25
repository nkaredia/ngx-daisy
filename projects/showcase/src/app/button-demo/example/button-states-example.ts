import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'demo-button-states-example',
  imports: [DsyButton],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <button dsyButton shape="square" aria-label="Add">＋</button
      ><button dsyButton shape="circle" aria-label="Favorite">♥</button
      ><button dsyButton layout="wide">Wide</button><button dsyButton active>Active</button
      ><button dsyButton loading color="primary">Saving</button
      ><a
        dsyButton
        variant="outline"
        href="https://daisyui.com/components/button/"
        target="_blank"
        rel="noreferrer"
        >Documentation</a
      ><a dsyButton disabled href="/buttons">Disabled link</a>
    </div>
    <button dsyButton layout="block" class="mt-4">Full width</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonStatesExample {}
