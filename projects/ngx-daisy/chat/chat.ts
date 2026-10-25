import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-chat, [dsyChat]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyChat {
  private readonly daisy = injectDaisyUIClasses();
  readonly position = input<'start' | 'end'>('start');
  readonly classes = computed(() =>
    this.daisy('chat', { start: 'chat-start', end: 'chat-end' }[this.position()]),
  );
}
@Component({
  selector: 'dsy-chat-bubble, [dsyChatBubble]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyChatBubble {
  private readonly daisy = injectDaisyUIClasses();
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly classes = computed(() =>
    this.daisy(
      'chat-bubble',
      {
        neutral: 'chat-bubble-neutral',
        primary: 'chat-bubble-primary',
        secondary: 'chat-bubble-secondary',
        accent: 'chat-bubble-accent',
        info: 'chat-bubble-info',
        success: 'chat-bubble-success',
        warning: 'chat-bubble-warning',
        error: 'chat-bubble-error',
      }[this.color()!] ?? '',
    ),
  );
}
@Component({
  selector: 'dsy-chat-header, [dsyChatHeader]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyChatHeader {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('chat-header', ''));
}
@Component({
  selector: 'dsy-chat-footer, [dsyChatFooter]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyChatFooter {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('chat-footer', ''));
}
@Component({
  selector: 'dsy-chat-image, [dsyChatImage]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyChatImage {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('chat-image', ''));
}
