import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyAvatar } from '@ngx-daisy/cdk/avatar';
export interface AvatarExampleValues {
  readonly status?: ReturnType<DsyAvatar['status']>;
  readonly placeholder?: ReturnType<DsyAvatar['placeholder']>;
}
@Component({
  selector: 'demo-avatar-example',
  standalone: true,
  imports: [DsyAvatar],
  templateUrl: './avatar-example.html',
  styleUrl: './avatar-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AvatarExample {
  readonly values = input<readonly AvatarExampleValues[]>([]);
  readonly props = computed<AvatarExampleValues>(() => this.values()[0] ?? {});
}
