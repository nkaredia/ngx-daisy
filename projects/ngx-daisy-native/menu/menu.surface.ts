import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsyControlIcon } from '@ngx-daisy/native/control-icon';
import { Check } from 'lucide';
import type { DsyNativeMenuItem, DsyNativeMenuOptions } from './menu.types';
export const DSY_MENU_DATA = new InjectionToken<{
  items: readonly DsyNativeMenuItem[];
  options: DsyNativeMenuOptions;
  choose(id: string): void;
}>('DsyNativeMenuData');
@Component({
  selector: 'dsy-native-menu-surface',
  standalone: true,
  imports: [DsyButton, NgTemplateOutlet, DsyControlIcon],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<StackLayout>
    @for (item of data.items; track item.id; let index = $index) {
      @if (item.section && (index === 0 || data.items[index - 1].section !== item.section)) {
        <Label
          [text]="item.section"
          class="dsy-native-menu-section"
          accessibilityRole="header"
        ></Label>
      }
      <GridLayout
        class="dsy-native-menu-item"
        [class]="data.options.itemClass ?? ''"
        [class.dsy-native-menu-checked]="item.checked"
        [class.dsy-native-menu-disabled]="item.disabled"
        [class.dsy-native-menu-destructive]="item.destructive"
      >
        <Button
          dsyButton
          text=""
          variant="ghost"
          dsyLayout="block"
          verticalAlignment="stretch"
          [disabled]="!!item.disabled"
          [active]="!!item.checked"
          [accessibilityLabel]="item.label"
          [accessibilityHint]="item.description ?? ''"
          (pressed)="data.choose(item.id)"
        ></Button>
        <GridLayout
          columns="24, *"
          class="dsy-native-menu-item-content"
          [isUserInteractionEnabled]="false"
          [accessible]="false"
          [accessibilityHidden]="true"
        >
          <Image
            [dsyControlIcon]="item.checked ? checkIcon : undefined"
            class="dsy-native-menu-check"
            verticalAlignment="middle"
            [accessible]="false"
          ></Image>
          <StackLayout col="1" verticalAlignment="middle">
            @if (data.options.itemTemplate) {
              <ng-container
                [ngTemplateOutlet]="data.options.itemTemplate"
                [ngTemplateOutletContext]="{ $implicit: item, checked: !!item.checked }"
              />
            } @else {
              <Label
                [text]="item.label"
                textWrap="true"
                class="dsy-native-menu-label"
                [accessible]="false"
              ></Label>
              @if (item.description) {
                <Label
                  [text]="item.description"
                  textWrap="true"
                  class="dsy-native-menu-description"
                  [accessible]="false"
                ></Label>
              }
            }
          </StackLayout>
        </GridLayout>
      </GridLayout>
    }
  </StackLayout>`,
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNativeMenuSurface {
  readonly checkIcon = Check;
  readonly data = inject(DSY_MENU_DATA);
}
