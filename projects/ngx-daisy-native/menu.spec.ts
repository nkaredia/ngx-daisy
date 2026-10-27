import { TestBed } from '@angular/core/testing';
import type { View } from '@nativescript/core';
import { DSY_NATIVE_MENU_PRESENTER, DsyNativeMenuService } from './menu/menu.service';
import type { DsyNativeMenuOptions } from './menu/menu.types';
import { presentNativeMenu } from './menu/native-menu';

afterEach(() => vi.unstubAllGlobals());

it('keeps the iOS anchor alive until dismissal animation ends, then removes it once', () => {
  type Action = { handler(): void; attributes: number; state: number; subtitle: string };
  const actions: Action[] = [];
  let implementation!: Record<string, (...args: unknown[]) => void>;
  let complete!: () => void;
  const removeFromSuperview = vi.fn();
  const button = {
    removeFromSuperview,
    performPrimaryAction: () =>
      implementation['contextMenuInteractionWillDisplayMenuForConfigurationAnimator'].call(button),
    contextMenuInteraction: {
      dismissMenu: () =>
        implementation['contextMenuInteractionWillEndForConfigurationAnimator'].call(
          button,
          null,
          null,
          { addCompletion: (callback: () => void) => (complete = callback) },
        ),
    },
    menu: undefined as unknown,
  };
  vi.stubGlobal('NSClassFromString', () => null);
  vi.stubGlobal('UIButton', {
    prototype: {},
    extend: (methods: typeof implementation) => {
      implementation = methods;
      return { new: () => button };
    },
  });
  vi.stubGlobal('UIAction', {
    actionWithTitleImageIdentifierHandler: (
      _title: string,
      _image: unknown,
      _id: string,
      handler: () => void,
    ) => {
      const action = { handler, attributes: 0, state: 0, subtitle: '' };
      actions.push(action);
      return action;
    },
  });
  vi.stubGlobal('UIMenu', {
    menuWithTitleImageIdentifierOptionsChildren: (
      title: string,
      _image: unknown,
      _id: unknown,
      flags: number,
      children: unknown[],
    ) => ({ title, flags, children }),
  });
  const selected = vi.fn();
  const closed = vi.fn();
  const ref = presentNativeMenu(
    { ios: { bounds: {}, addSubview: vi.fn() } } as unknown as View,
    [
      { id: 'a', label: 'Chosen', checked: true, description: 'Details', section: 'Group' },
      { id: 'b', label: 'Remove', disabled: true, destructive: true },
    ],
    { selected, closed, singleSelection: true },
  );
  expect(actions[0]).toMatchObject({ state: 1, subtitle: 'Details' });
  expect(actions[1].attributes).toBe(3);
  expect(button.menu).toMatchObject({ flags: 32, children: [{ title: 'Group', flags: 1 }, {}] });
  actions[1].handler();
  expect(selected).not.toHaveBeenCalled();
  ref.close();
  expect(removeFromSuperview).not.toHaveBeenCalled();
  complete();
  complete();
  actions[0].handler();
  expect(closed).toHaveBeenCalledTimes(1);
  expect(removeFromSuperview).toHaveBeenCalledTimes(1);
  expect(selected).not.toHaveBeenCalled();
});

it('cleans up an unloaded anchor and replays dismissal once, ignoring late selections', () => {
  let callbacks!: DsyNativeMenuOptions;
  let unload!: () => void;
  const anchor = {
    on: vi.fn((_event: string, listener: () => void) => (unload = listener)),
    off: vi.fn(),
  };
  const close = vi.fn(() => callbacks.closed());
  TestBed.configureTestingModule({
    providers: [
      {
        provide: DSY_NATIVE_MENU_PRESENTER,
        useValue: (_anchor: unknown, _items: unknown, options: DsyNativeMenuOptions) => {
          callbacks = options;
          return { close };
        },
      },
    ],
  });
  const selected = vi.fn();
  const ref = TestBed.inject(DsyNativeMenuService).open(anchor as unknown as View, [], {
    selected,
  });
  callbacks.selected('first');
  unload();
  ref.close();
  callbacks.closed();
  callbacks.selected('late');
  const dismissed = vi.fn();
  ref.closed.subscribe(dismissed);
  expect(close).toHaveBeenCalledTimes(1);
  expect(dismissed).toHaveBeenCalledTimes(1);
  expect(selected).toHaveBeenCalledExactlyOnceWith('first');
  expect(anchor.off).toHaveBeenCalledExactlyOnceWith('unloaded', unload);
});

it('releases the unload listener when a platform cannot present a menu', () => {
  const anchor = { on: vi.fn(), off: vi.fn() };
  TestBed.configureTestingModule({
    providers: [
      {
        provide: DSY_NATIVE_MENU_PRESENTER,
        useValue: () => {
          throw new Error('No native anchor');
        },
      },
    ],
  });
  expect(() =>
    TestBed.inject(DsyNativeMenuService).open(anchor as unknown as View, [], {
      selected: vi.fn(),
    }),
  ).toThrow('No native anchor');
  expect(anchor.off).toHaveBeenCalledWith('unloaded', expect.any(Function));
});

it('uses Android PopupMenu selection and outside-dismiss callbacks without duplicate results', () => {
  const entries: { id: number; enabled: boolean; checked?: boolean }[] = [];
  let choose!: { onMenuItemClick(item: { getItemId(): number }): boolean };
  let dismissed!: { onDismiss(): void };
  const dismiss = vi.fn(() => dismissed.onDismiss());
  class PopupMenu {
    static OnMenuItemClickListener = class {
      constructor(implementation: object) {
        Object.assign(this, implementation);
      }
    };
    static OnDismissListener = class {
      constructor(implementation: object) {
        Object.assign(this, implementation);
      }
    };
    getMenu() {
      return {
        add: (_group: number, id: number) => {
          const entry = { id, enabled: true, checked: undefined as boolean | undefined };
          entries.push(entry);
          const item = {
            setEnabled(value: boolean) {
              entry.enabled = value;
              return item;
            },
            setCheckable() {
              return item;
            },
            setChecked(value: boolean) {
              entry.checked = value;
              return item;
            },
          };
          return item;
        },
      };
    }
    setOnMenuItemClickListener(listener: typeof choose) {
      choose = listener;
    }
    setOnDismissListener(listener: typeof dismissed) {
      dismissed = listener;
    }
    show() {}
    dismiss = dismiss;
  }
  vi.stubGlobal('android', { widget: { PopupMenu } });
  const selected = vi.fn();
  const closed = vi.fn();
  const ref = presentNativeMenu(
    { android: { getContext: () => ({}) } } as unknown as View,
    [
      { id: 'a', label: 'Selected', checked: true },
      { id: 'b', label: 'Unavailable', disabled: true },
    ],
    { selected, closed },
  );
  expect(entries).toEqual([
    { id: 1, enabled: true, checked: true },
    { id: 2, enabled: false },
  ]);
  expect(choose.onMenuItemClick({ getItemId: () => 2 })).toBe(false);
  expect(choose.onMenuItemClick({ getItemId: () => 1 })).toBe(true);
  choose.onMenuItemClick({ getItemId: () => 1 });
  dismissed.onDismiss();
  ref.close();
  expect(selected).toHaveBeenCalledExactlyOnceWith('a');
  expect(closed).toHaveBeenCalledTimes(1);
  expect(dismiss).not.toHaveBeenCalled();
});
