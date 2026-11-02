import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { LucideCopy, LucidePencil, LucideChevronDown } from '@lucide/angular';
import { DsyButton } from '@ngx-daisy/cdk/button';
import {
  DsyDropdown,
  DsyDropdownTrigger,
  DsyDropdownContent,
  DsyDropdownItem,
} from '@ngx-daisy/cdk/dropdown';

@Component({
  selector: 'demo-dropdown-actions-example',
  standalone: true,
  imports: [
    DsyButton,
    DsyDropdown,
    DsyDropdownTrigger,
    DsyDropdownContent,
    DsyDropdownItem,
    LucideCopy,
    LucidePencil,
    LucideChevronDown,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <dsy-dropdown aria-label="Document actions">
      <button dsyButton dsyDropdownTrigger type="button">
        Document actions <svg lucideChevronDown size="1em" aria-hidden="true"></svg>
      </button>
      <ng-template dsyDropdownContent>
        <button dsyDropdownItem (triggered)="message.set('Document ready to edit')">
          <svg lucidePencil size="1em" aria-hidden="true"></svg> Edit document
        </button>
        <button dsyDropdownItem (triggered)="message.set('Document duplicated')">
          <svg lucideCopy size="1em" aria-hidden="true"></svg> Duplicate
        </button>
        <button dsyDropdownItem disabled>Archive unavailable</button>
      </ng-template>
    </dsy-dropdown>
    <p role="status" class="mt-4 min-h-6 text-sm">{{ message() }}</p>
  `,
})
export class DropdownActionsExample {
  readonly message = signal('Choose an action for the current document.');
}
