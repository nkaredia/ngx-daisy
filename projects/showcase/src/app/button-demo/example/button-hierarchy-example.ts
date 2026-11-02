import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'demo-button-hierarchy-example',
  imports: [DsyButton],
  template: `
    <section class="w-full max-w-md space-y-5" aria-label="Workspace sharing">
      <div class="space-y-2">
        <h4 class="text-lg font-semibold">Workspace sharing</h4>
        <p>Only invited team members can access this workspace.</p>
        <p class="text-sm">
          Save your sharing preferences, or cancel to keep the current settings.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button dsyButton type="button" color="primary">Save changes</button>
        <button dsyButton type="button" variant="ghost">Cancel</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonHierarchyExample {}
