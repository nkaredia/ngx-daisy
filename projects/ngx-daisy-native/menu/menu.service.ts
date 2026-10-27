import { Injectable, InjectionToken, inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import type { View } from '@nativescript/core';
import { presentNativeMenu } from './native-menu';
import type {
  DsyNativeMenuHandle,
  DsyNativeMenuItem,
  DsyNativeMenuPresenter,
  DsyNativeMenuOptions,
} from './menu.types';
export const DSY_NATIVE_MENU_PRESENTER = new InjectionToken<DsyNativeMenuPresenter>(
  'DsyNativeMenuPresenter',
  { providedIn: 'root', factory: () => presentNativeMenu },
);
export interface DsyNativeMenuRef extends DsyNativeMenuHandle {
  readonly closed: ReplaySubject<void>;
}
@Injectable({ providedIn: 'root' })
export class DsyNativeMenuService {
  private readonly present = inject(DSY_NATIVE_MENU_PRESENTER);
  open(
    anchor: View,
    items: readonly DsyNativeMenuItem[],
    options: Omit<DsyNativeMenuOptions, 'closed'>,
  ): DsyNativeMenuRef {
    const closed = new ReplaySubject<void>(1);
    let done = false;
    let handle: DsyNativeMenuHandle | undefined;
    const finish = () => {
      if (done) return;
      done = true;
      anchor.off('unloaded', close);
      closed.next();
      closed.complete();
    };
    const close = () => {
      if (!done) handle?.close();
    };
    anchor.on('unloaded', close);
    try {
      handle = this.present(anchor, items, {
        ...options,
        selected: (id) => {
          if (!done) options.selected(id);
        },
        closed: finish,
      });
    } catch (error) {
      anchor.off('unloaded', close);
      throw error;
    }
    return { close, closed };
  }
}
