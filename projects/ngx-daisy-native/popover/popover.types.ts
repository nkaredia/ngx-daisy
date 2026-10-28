import type { Injector, TemplateRef, Type } from '@angular/core';
import type { View } from '@nativescript/core';
import type { Observable } from 'rxjs';
import type { DsyThemeDefinition } from '@ngx-daisy/core/theme';
export type DsyPopoverCloseReason = 'dismiss' | 'selection' | 'owner' | 'superseded' | 'error';
export interface DsyPopoverConfig {
  readonly label?: string;
  readonly width?: number | 'anchor';
  readonly maxHeight?: number;
  readonly gap?: number;
  readonly placement?: 'auto' | 'bottom' | 'top';
  readonly align?: 'start' | 'end';
  readonly panelClass?: string;
  readonly backdropClass?: string;
  readonly theme?: DsyThemeDefinition | (() => DsyThemeDefinition);
  readonly injector?: Injector;
  readonly initialFocus?: () => View | undefined;
  readonly restoreFocus?: boolean;
}
export interface DsyPopoverRef {
  readonly closed: Observable<DsyPopoverCloseReason>;
  readonly opened: Promise<void>;
  close(reason?: DsyPopoverCloseReason): void;
}
export type DsyPopoverContent = TemplateRef<unknown> | Type<unknown>;
