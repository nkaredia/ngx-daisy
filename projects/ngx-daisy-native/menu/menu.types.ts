import type { TemplateRef } from '@angular/core';
import type { DsyPopoverConfig } from '@ngx-daisy/native/popover';
export interface DsyNativeMenuItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly checked?: boolean;
  readonly destructive?: boolean;
  readonly section?: string;
}
export interface DsyNativeMenuItemContext {
  readonly $implicit: DsyNativeMenuItem;
  readonly checked: boolean;
}
export interface DsyNativeMenuOptions extends DsyPopoverConfig {
  readonly itemClass?: string;
  readonly itemTemplate?: TemplateRef<DsyNativeMenuItemContext>;
  readonly selected: (id: string) => void;
}
