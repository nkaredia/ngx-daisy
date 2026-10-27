import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  signal,
  input,
} from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsyModal } from '@ngx-daisy/native/modal';
import {
  DsyDropdown,
  DsyDropdownTrigger,
  DsyDropdownContent,
  DsyDropdownItem,
} from '@ngx-daisy/native/dropdown';
import { DsyFab, DsyFabTrigger, DsyFabAction, DsyFabClose } from '@ngx-daisy/native/fab';
import { DsySwap } from '@ngx-daisy/native/swap';
import {
  DsyThemeController,
  type DsyThemeControllerChange,
} from '@ngx-daisy/native/theme-controller';
import { DsyTheme, DSY_DARK_THEME, DSY_LIGHT_THEME } from '@ngx-daisy/native/theme';
@Component({
  selector: 'dsy-native-actions-example',
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    FormField,
    DsyButton,
    DsyModal,
    DsyDropdown,
    DsyDropdownTrigger,
    DsyDropdownContent,
    DsyDropdownItem,
    DsyFab,
    DsyFabTrigger,
    DsyFabAction,
    DsyFabClose,
    DsySwap,
    DsyThemeController,
    DsyTheme,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './actions-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeActionsExample {
  readonly family = input<'dropdowns' | 'fabs' | 'modals' | 'swaps' | 'theme-controllers'>(
    'dropdowns',
  );
  readonly message = signal('Your workspace is up to date.');
  readonly preferences = signal({ sound: true });
  readonly preferenceForm = form(this.preferences);
  readonly darkTheme = DSY_DARK_THEME;
  readonly lightTheme = DSY_LIGHT_THEME;
  readonly localDark = signal(false);
  readonly localTheme = signal(DSY_LIGHT_THEME);
  readonly locked = signal(false);
  readonly projectName = signal('Summer collection');
  readonly privateProject = signal(true);
  select(action: string): void {
    this.message.set(action);
  }
  setTheme(event: DsyThemeControllerChange): void {
    this.localDark.set(event.checked);
    this.localTheme.set(event.checked ? event.theme : DSY_LIGHT_THEME);
  }
}
