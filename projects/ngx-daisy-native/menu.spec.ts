import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import type { View } from '@nativescript/core';
import { DsyPopoverService } from '@ngx-daisy/native/popover';
import { DsyNativeMenuService } from './menu/menu.service';
import { DSY_MENU_DATA } from './menu/menu.surface';
vi.mock('@nativescript/core', () => ({
  GridLayout: class GridLayout {},
  CSSType: () => () => {},
  AbsoluteLayout: class AbsoluteLayout {},
  isIOS: false,
  Application: {},
  getRootLayout: vi.fn(),
}));
vi.mock('@nativescript/angular', () => ({
  registerElement: vi.fn(),
  generateNativeScriptView: vi.fn(),
}));
it('renders menu metadata through the custom popover and guards stale, disabled and repeated selections', () => {
  const closed = new ReplaySubject<void>(1);
  const close = vi.fn(() => {
    closed.next();
    closed.complete();
  });
  const open = vi.fn(
    (
      _anchor: unknown,
      _component: unknown,
      _config: { injector?: import('@angular/core').Injector },
    ) => ({ close, closed, opened: Promise.resolve() }),
  );
  TestBed.configureTestingModule({
    providers: [{ provide: DsyPopoverService, useValue: { open } }],
  });
  const selected = vi.fn();
  TestBed.inject(DsyNativeMenuService).open(
    {} as View,
    [
      { id: 'a', label: 'Selected', checked: true },
      { id: 'b', label: 'Unavailable', disabled: true },
    ],
    { selected, panelClass: 'custom-panel' },
  );
  const config = open.mock.calls[0][2];
  const data = config.injector!.get(DSY_MENU_DATA);
  expect(data.items[0].checked).toBe(true);
  data.choose('b');
  data.choose('missing');
  expect(selected).not.toHaveBeenCalled();
  data.choose('a');
  data.choose('a');
  expect(selected).toHaveBeenCalledExactlyOnceWith('a');
  expect(close).toHaveBeenCalledExactlyOnceWith('selection');
});
it('does not change a value after an outside dismissal', () => {
  const closed = new ReplaySubject<void>(1);
  const open = vi.fn(
    (
      _anchor: unknown,
      _component: unknown,
      _config: { injector?: import('@angular/core').Injector },
    ) => ({ close: vi.fn(), closed, opened: Promise.resolve() }),
  );
  TestBed.configureTestingModule({
    providers: [{ provide: DsyPopoverService, useValue: { open } }],
  });
  const selected = vi.fn();
  TestBed.inject(DsyNativeMenuService).open({} as View, [{ id: 'a', label: 'A' }], { selected });
  const data = open.mock.calls[0][2].injector!.get(DSY_MENU_DATA);
  closed.next();
  data.choose('a');
  expect(selected).not.toHaveBeenCalled();
});
