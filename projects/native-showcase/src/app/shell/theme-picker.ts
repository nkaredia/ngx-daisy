import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { DsyButton } from '@ngx-daisy/native/button';
import {
  DsyDropdown,
  DsyDropdownContent,
  DsyDropdownTrigger,
  DsyDropdownItem,
} from '@ngx-daisy/native/dropdown';
import { DsyTheme, type DsyThemeDefinition } from '@ngx-daisy/native/theme';
import { DsyIcon } from '@ngx-daisy/native/icon';
import { Check, ChevronDown } from 'lucide';
import { lucideArtwork } from '../icons/svg-artwork';
import { NativeThemeSwatch } from './theme-swatch';

@Component({
  selector: 'StackLayout[appThemePicker]',
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    DsyButton,
    DsyDropdown,
    DsyDropdownContent,
    DsyDropdownTrigger,
    DsyDropdownItem,
    DsyTheme,
    DsyIcon,
    NativeThemeSwatch,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<StackLayout dsyDropdown label="Choose a theme" [panelWidth]="240" [maxHeight]="400">
    <GridLayout height="44" width="64" dsyDropdownTrigger>
      <Button
        dsyButton
        dsyDropdownTrigger
        text=""
        variant="ghost"
        size="sm"
        accessibilityLabel="Choose a theme"
        horizontalAlignment="stretch"
      ></Button>
      <GridLayout
        columns="auto, auto"
        horizontalAlignment="center"
        verticalAlignment="middle"
        [isUserInteractionEnabled]="false"
        accessible="false"
      >
        <GridLayout appThemeSwatch verticalAlignment="middle"></GridLayout>
        <GridLayout col="1" dsyIcon [size]="12" marginLeft="5" verticalAlignment="middle"
          ><AppSvgIcon [artwork]="chevron" accessible="false"></AppSvgIcon
        ></GridLayout>
      </GridLayout>
    </GridLayout>
    <ng-template dsyDropdownContent>
      <StackLayout class="p-2">
        <Label
          text="Theme"
          class="text-[12px] font-semibold opacity-60 px-2 py-2"
          accessibilityRole="header"
        ></Label>
        @for (preset of presets(); track preset.name) {
          <GridLayout height="44" marginBottom="2">
            <Button
              dsyButton
              dsyDropdownItem
              [label]="preset.name + (selected() === preset.name ? ' (selected)' : '')"
              [accessibilityLabel]="preset.name + (selected() === preset.name ? ' (selected)' : '')"
              text=""
              variant="ghost"
              dsyLayout="block"
              (triggered)="selectedTheme.emit(preset)"
            ></Button>
            <GridLayout
              columns="auto, *, auto"
              class="px-2"
              [isUserInteractionEnabled]="false"
              accessible="false"
            >
              <GridLayout
                appThemeSwatch
                [dsyTheme]="preset"
                verticalAlignment="middle"
              ></GridLayout>
              <Label
                col="1"
                [text]="preset.name"
                class="text-[14px] ml-3"
                verticalAlignment="middle"
              ></Label>
              <GridLayout
                col="2"
                dsyIcon
                [size]="16"
                [opacity]="selected() === preset.name ? 1 : 0"
                verticalAlignment="middle"
                ><AppSvgIcon [artwork]="check" accessible="false"></AppSvgIcon
              ></GridLayout>
            </GridLayout>
          </GridLayout>
        }
      </StackLayout>
    </ng-template>
  </StackLayout>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeThemePicker {
  readonly presets = input.required<readonly DsyThemeDefinition[]>();
  readonly selected = input.required<string>();
  readonly selectedTheme = output<DsyThemeDefinition>();
  readonly chevron = lucideArtwork(ChevronDown);
  readonly check = lucideArtwork(Check);
}
