import type { View } from '@nativescript/core';
export interface DsyNativeMenuItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly checked?: boolean;
  readonly destructive?: boolean;
  readonly section?: string;
}
export interface DsyNativeMenuHandle {
  close(): void;
}
export interface DsyNativeMenuOptions {
  readonly label?: string;
  readonly singleSelection?: boolean;
  readonly appearance?: 'light' | 'dark';
  readonly selected: (id: string) => void;
  readonly closed: () => void;
}
export type DsyNativeMenuPresenter = (
  anchor: View,
  items: readonly DsyNativeMenuItem[],
  options: DsyNativeMenuOptions,
) => DsyNativeMenuHandle;
