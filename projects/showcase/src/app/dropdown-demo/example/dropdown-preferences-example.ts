import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';
import { DsyDropdown, DsyDropdownTrigger, DsyDropdownContent } from '@ngx-daisy/cdk/dropdown';

@Component({
  selector: 'demo-dropdown-preferences-example',
  standalone: true,
  imports: [DsyButton, DsyCheckbox, DsyDropdown, DsyDropdownTrigger, DsyDropdownContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <dsy-dropdown
      kind="content"
      [(opened)]="opened"
      aria-label="Notification preferences"
      panelClass="w-64 max-w-[calc(100vw-2rem)]"
    >
      <button dsyButton dsyDropdownTrigger type="button" variant="outline">Notifications</button>
      <ng-template dsyDropdownContent>
        <p class="font-semibold">Stay up to date</p>
        <p class="mt-2 text-sm">Choose which workspace updates reach your inbox.</p>
        <label class="mt-4 flex items-center gap-3">
          <input
            dsyCheckbox
            type="checkbox"
            [checked]="weekly()"
            (change)="weekly.set($event.target.checked)"
          />
          Weekly summary
        </label>
        <button dsyButton type="button" class="mt-4" size="sm" (click)="opened.set(false)">
          Done
        </button>
      </ng-template>
    </dsy-dropdown>
    <p role="status" class="mt-4 min-h-6 text-sm">Weekly summary {{ weekly() ? 'on' : 'off' }}</p>
  `,
})
export class DropdownPreferencesExample {
  readonly opened = signal(false);
  readonly weekly = signal(true);
}
