import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
} from '@angular/core';
import { DsyIcon } from '@ngx-daisy/native/icon';
import { House, Heart, Settings, CircleCheck } from 'lucide';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { lucideArtwork, fontAwesomeArtwork } from '../icons/svg-artwork';

@Component({
  selector: 'dsy-native-icon-example',
  standalone: true,
  imports: [DsyIcon],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <StackLayout>
      <Label
        text="Your icons. Your choice."
        class="text-[26px] font-bold mb-3"
        textWrap="true"
      ></Label>
      <Label
        text="Real Lucide and Font Awesome vectors, rendered natively. The app imports each icon; ngx-daisy supplies size, theme color and accessibility."
        class="opacity-75 mb-5"
        textWrap="true"
      ></Label>
      <StackLayout class="bg-base-200 rounded-box p-5 mb-5">
        <Label text="Lucide" class="text-xl font-bold mb-2" accessibilityRole="header"></Label>
        <Label
          text="A lightweight outline for everyday actions."
          class="opacity-75 mb-4"
          textWrap="true"
        ></Label>
        <GridLayout columns="*, *, *, *">
          <GridLayout col="0" dsyIcon [size]="32" dsyColor="primary" label="Home"
            ><AppSvgIcon
              [artwork]="lucide.house"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="1" dsyIcon [size]="32" dsyColor="error" label="Favorites"
            ><AppSvgIcon
              [artwork]="lucide.heart"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="2" dsyIcon [size]="32" dsyColor="secondary" label="Settings"
            ><AppSvgIcon
              [artwork]="lucide.settings"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="3" dsyIcon [size]="32" dsyColor="success" label="Confirmed"
            ><AppSvgIcon
              [artwork]="lucide.check"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
        </GridLayout>
      </StackLayout>
      <StackLayout class="bg-base-200 rounded-box p-5 mb-5">
        <Label
          text="Font Awesome"
          class="text-xl font-bold mb-2"
          accessibilityRole="header"
        ></Label>
        <Label
          text="Mix free solid, regular and brand icons."
          class="opacity-75 mb-4"
          textWrap="true"
        ></Label>
        <GridLayout columns="*, *, *, *">
          <GridLayout col="0" dsyIcon [size]="32" dsyColor="primary" label="Home"
            ><AppSvgIcon
              [artwork]="fontAwesome.house"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="1" dsyIcon [size]="32" dsyColor="error" label="Favorites"
            ><AppSvgIcon
              [artwork]="fontAwesome.heart"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="2" dsyIcon [size]="32" dsyColor="secondary" label="Settings"
            ><AppSvgIcon
              [artwork]="fontAwesome.settings"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="3" dsyIcon [size]="32" label="GitHub"
            ><AppSvgIcon
              [artwork]="fontAwesome.github"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
        </GridLayout>
      </StackLayout>
      <StackLayout class="bg-base-200 rounded-box p-5">
        <Label
          text="One wrapper, every size"
          class="text-xl font-bold mb-4"
          textWrap="true"
          accessibilityRole="header"
        ></Label>
        <GridLayout columns="*, *, *">
          <GridLayout col="0" dsyIcon [size]="20" dsyColor="accent"
            ><AppSvgIcon
              [artwork]="lucide.heart"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="1" dsyIcon [size]="32" dsyColor="accent"
            ><AppSvgIcon
              [artwork]="lucide.heart"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
          <GridLayout col="2" dsyIcon [size]="48" dsyColor="accent"
            ><AppSvgIcon
              [artwork]="lucide.heart"
              stretch="aspectFit"
              accessible="false"
            ></AppSvgIcon
          ></GridLayout>
        </GridLayout>
        <Label
          text="Switch the app theme to see both packs follow the same design tokens. No full icon collection or font is registered."
          class="opacity-75 mt-4"
          textWrap="true"
        ></Label>
      </StackLayout>
    </StackLayout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeIconExample {
  readonly lucide = {
    house: lucideArtwork(House),
    heart: lucideArtwork(Heart),
    settings: lucideArtwork(Settings),
    check: lucideArtwork(CircleCheck),
  };
  readonly fontAwesome = {
    house: fontAwesomeArtwork(faHouse),
    heart: fontAwesomeArtwork(faHeart),
    settings: fontAwesomeArtwork(faGear),
    github: fontAwesomeArtwork(faGithub),
  };
}
