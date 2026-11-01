import { Injectable, Injector, inject } from '@angular/core';
import type { View } from '@nativescript/core';
import { DsyPopoverService, type DsyPopoverRef } from '@ngx-daisy/native/popover';
import { DSY_MENU_DATA, DsyNativeMenuSurface } from './menu.surface';
import type { DsyNativeMenuItem, DsyNativeMenuOptions } from './menu.types';
export type DsyNativeMenuRef = DsyPopoverRef;
@Injectable({ providedIn: 'root' })
export class DsyNativeMenuService {
  private readonly popovers = inject(DsyPopoverService);
  private readonly injector = inject(Injector);
  open(
    anchor: View,
    items: readonly DsyNativeMenuItem[],
    options: DsyNativeMenuOptions,
  ): DsyNativeMenuRef {
    let ref: DsyPopoverRef;
    let active = true;
    const choose = (id: string) => {
      if (!active || !items.some((item) => item.id === id && !item.disabled)) return;
      active = false;
      options.selected(id);
      ref.close('selection');
    };
    const injector = Injector.create({
      parent: options.injector ?? this.injector,
      providers: [{ provide: DSY_MENU_DATA, useValue: { items, options, choose } }],
    });
    ref = this.popovers.open(anchor, DsyNativeMenuSurface, { ...options, injector });
    ref.closed.subscribe(() => (active = false));
    return ref;
  }
}
