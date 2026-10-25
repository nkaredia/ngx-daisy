import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
} from '@angular/core';
import { DsyAvatar, DsyAvatarGroup } from '@ngx-daisy/cdk/avatar';

@Component({
  selector: 'demo-avatar-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyAvatar, DsyAvatarGroup],
  templateUrl: './avatar-demo.html',
  styleUrl: './avatar-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AvatarDemo {
  readonly playground = playground;
}
