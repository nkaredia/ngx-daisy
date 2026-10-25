import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-avatar, [dsyAvatar]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyAvatar {
  private readonly daisy = injectDaisyUIClasses();
  readonly status = input<'none' | 'online' | 'offline'>('none');
  readonly placeholder = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      'avatar',
      { none: '', online: 'avatar-online', offline: 'avatar-offline' }[this.status()],
      this.placeholder() ? 'avatar-placeholder' : '',
    ),
  );
}
@Component({
  selector: 'dsy-avatar-group, [dsyAvatarGroup]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyAvatarGroup {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('avatar-group', ''));
}
