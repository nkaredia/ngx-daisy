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
  templateUrl: './icon-example.html',
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
