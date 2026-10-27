import type { View } from '@nativescript/core';
import type { DsyNativeMenuHandle, DsyNativeMenuItem, DsyNativeMenuOptions } from './menu.types';

// Local bridge shapes keep platform SDK globals out of the public declarations.
interface IOSAction {
  attributes: number;
  state: number;
  subtitle?: string;
}
interface IOSAnimator {
  addCompletion(callback: () => void): void;
}
interface IOSButton {
  bounds: unknown;
  frame: unknown;
  window?: unknown;
  autoresizingMask: number;
  menu: unknown;
  showsMenuAsPrimaryAction: boolean;
  isAccessibilityElement: boolean;
  overrideUserInterfaceStyle: number;
  contextMenuInteraction?: { dismissMenu(): void };
  addSubview(view: IOSButton): void;
  removeFromSuperview(): void;
  performPrimaryAction(): void;
}
interface IOSFactory {
  new: () => IOSButton;
  extend(implementation: Record<string, unknown>, options: { name: string }): IOSFactory;
  prototype: {
    contextMenuInteractionWillDisplayMenuForConfigurationAnimator?: (
      interaction: unknown,
      configuration: unknown,
      animator: IOSAnimator | null,
    ) => void;
    contextMenuInteractionWillEndForConfigurationAnimator?: (
      interaction: unknown,
      configuration: unknown,
      animator: IOSAnimator | null,
    ) => void;
  };
}
declare const UIButton: IOSFactory;
declare function NSClassFromString(name: string): IOSFactory | null;
declare const UIAction: {
  actionWithTitleImageIdentifierHandler(
    title: string,
    image: null,
    identifier: string,
    handler: () => void,
  ): IOSAction;
};
declare const UIMenu: {
  menuWithTitleImageIdentifierOptionsChildren(
    title: string,
    image: null,
    identifier: null,
    options: number,
    children: readonly unknown[],
  ): unknown;
};
interface IOSSession {
  displayed(): void;
  ending(): void;
  finished(): void;
}
const sessions = new WeakMap<IOSButton, IOSSession>();
let iosFactory: IOSFactory | undefined;
function menuButtonClass(): IOSFactory {
  if (iosFactory) return iosFactory;
  iosFactory =
    NSClassFromString('DsyNativeMenuAnchor') ??
    UIButton.extend(
      {
        contextMenuInteractionWillDisplayMenuForConfigurationAnimator(
          this: IOSButton,
          interaction: unknown,
          configuration: unknown,
          animator: IOSAnimator | null,
        ) {
          UIButton.prototype.contextMenuInteractionWillDisplayMenuForConfigurationAnimator?.call(
            this,
            interaction,
            configuration,
            animator,
          );
          sessions.get(this)?.displayed();
        },
        contextMenuInteractionWillEndForConfigurationAnimator(
          this: IOSButton,
          interaction: unknown,
          configuration: unknown,
          animator: IOSAnimator | null,
        ) {
          UIButton.prototype.contextMenuInteractionWillEndForConfigurationAnimator?.call(
            this,
            interaction,
            configuration,
            animator,
          );
          sessions.get(this)?.ending();
          const finish = () => sessions.get(this)?.finished();
          if (animator) animator.addCompletion(finish);
          else finish();
        },
      },
      { name: 'DsyNativeMenuAnchor' },
    );
  return iosFactory;
}
function showIOS(
  anchor: IOSButton,
  items: readonly DsyNativeMenuItem[],
  options: DsyNativeMenuOptions,
): DsyNativeMenuHandle {
  const button = menuButtonClass().new();
  let finished = false;
  let ending = false;
  let visible = false;
  let selected = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    sessions.delete(button);
    button.removeFromSuperview();
    options.closed();
  };
  sessions.set(button, {
    displayed: () => {
      visible = true;
    },
    ending: () => {
      ending = true;
    },
    finished: finish,
  });
  const action = (item: DsyNativeMenuItem) => {
    const native = UIAction.actionWithTitleImageIdentifierHandler(item.label, null, item.id, () => {
      if (finished || selected || item.disabled) return;
      selected = true;
      ending = true;
      options.selected(item.id);
    });
    native.attributes = (item.disabled ? 1 : 0) | (item.destructive ? 2 : 0);
    native.state = item.checked ? 1 : 0;
    if (item.description && 'subtitle' in native) native.subtitle = item.description;
    return native;
  };
  const children: unknown[] = [];
  let index = 0;
  while (index < items.length) {
    const section = items[index].section;
    if (!section) {
      children.push(action(items[index++]));
      continue;
    }
    const group: unknown[] = [];
    while (index < items.length && items[index].section === section)
      group.push(action(items[index++]));
    children.push(
      UIMenu.menuWithTitleImageIdentifierOptionsChildren(section, null, null, 1, group),
    );
  }
  button.overrideUserInterfaceStyle =
    options.appearance === 'dark' ? 2 : options.appearance === 'light' ? 1 : 0;
  button.frame = anchor.bounds;
  button.autoresizingMask = 18;
  button.isAccessibilityElement = false;
  button.menu = UIMenu.menuWithTitleImageIdentifierOptionsChildren(
    options.label ?? '',
    null,
    null,
    options.singleSelection ? 32 : 0,
    children,
  );
  button.showsMenuAsPrimaryAction = true;
  anchor.addSubview(button);
  button.performPrimaryAction();
  return {
    close: () => {
      if (finished || ending) return;
      ending = true;
      if (visible && button.contextMenuInteraction) button.contextMenuInteraction.dismissMenu();
      else {
        button.menu = null;
        finish();
      }
    },
  };
}
interface AndroidItem {
  getItemId(): number;
  setEnabled(value: boolean): AndroidItem;
  setCheckable(value: boolean): AndroidItem;
  setChecked(value: boolean): AndroidItem;
}
interface AndroidPopup {
  getMenu(): { add(group: number, id: number, order: number, title: string): AndroidItem };
  setOnMenuItemClickListener(listener: unknown): void;
  setOnDismissListener(listener: unknown): void;
  show(): void;
  dismiss(): void;
}
declare const android: {
  widget: {
    PopupMenu: {
      new (context: unknown, anchor: unknown): AndroidPopup;
      OnMenuItemClickListener: new (implementation: {
        onMenuItemClick(item: AndroidItem): boolean;
      }) => unknown;
      OnDismissListener: new (implementation: { onDismiss(): void }) => unknown;
    };
  };
};
function showAndroid(
  anchor: { getContext(): unknown },
  items: readonly DsyNativeMenuItem[],
  options: DsyNativeMenuOptions,
): DsyNativeMenuHandle {
  const popup = new android.widget.PopupMenu(anchor.getContext(), anchor);
  let finished = false;
  let selected = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      options.closed();
    }
  };
  items.forEach((item, index) => {
    const native = popup
      .getMenu()
      .add(0, index + 1, index, item.label)
      .setEnabled(!item.disabled);
    if (item.checked !== undefined) native.setCheckable(true).setChecked(item.checked);
  });
  popup.setOnMenuItemClickListener(
    new android.widget.PopupMenu.OnMenuItemClickListener({
      onMenuItemClick(native) {
        const item = items[native.getItemId() - 1];
        if (!item || item.disabled || finished || selected) return false;
        selected = true;
        options.selected(item.id);
        return true;
      },
    }),
  );
  popup.setOnDismissListener(new android.widget.PopupMenu.OnDismissListener({ onDismiss: finish }));
  popup.show();
  return {
    close: () => {
      if (!finished && !selected) popup.dismiss();
    },
  };
}
/** The platform owns positioning, menu visuals, outside dismissal and keyboard interaction. */
export function presentNativeMenu(
  anchor: View,
  items: readonly DsyNativeMenuItem[],
  options: DsyNativeMenuOptions,
): DsyNativeMenuHandle {
  if (anchor.ios) return showIOS(anchor.ios as IOSButton, items, options);
  if (anchor.android)
    return showAndroid(anchor.android as { getContext(): unknown }, items, options);
  throw new Error('A native menu requires a loaded iOS or Android anchor view.');
}
