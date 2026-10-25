import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
  DestroyRef,
  signal,
  Injectable,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DsyAlert } from '@ngx-daisy/cdk/alert';
export interface DsyToastOptions {
  color?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  announcement?: 'polite' | 'assertive' | 'off';
}
export interface DsyToastMessage extends DsyToastOptions {
  id: number;
  text: string;
}
@Injectable({ providedIn: 'root' })
export class DsyToastService {
  private readonly announcer = inject(LiveAnnouncer);
  private nextId = 0;
  private readonly state = signal<readonly DsyToastMessage[]>([]);
  readonly messages = this.state.asReadonly();
  private readonly timers = new Map<
    number,
    {
      timer?: ReturnType<typeof setTimeout>;
      remaining: number;
      started: number;
      reasons: Set<string>;
    }
  >();
  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }
  show(text: string, options: DsyToastOptions = {}): number {
    const message = { id: ++this.nextId, text, ...options };
    this.state.update((items) => [...items, message]);
    if (options.announcement !== 'off')
      void this.announcer.announce(text, options.announcement ?? 'polite');
    if (Number.isFinite(options.duration) && options.duration! > 0) {
      this.timers.set(message.id, { remaining: options.duration!, started: 0, reasons: new Set() });
      this.resume(message.id, 'initial');
    }
    return message.id;
  }
  dismiss(id: number) {
    const record = this.timers.get(id);
    if (record?.timer) clearTimeout(record.timer);
    this.timers.delete(id);
    this.state.update((items) => items.filter((item) => item.id !== id));
  }
  clear() {
    for (const record of this.timers.values()) if (record.timer) clearTimeout(record.timer);
    this.timers.clear();
    this.state.set([]);
  }
  pause(id: number, reason = 'manual') {
    const record = this.timers.get(id);
    if (!record) return;
    record.reasons.add(reason);
    if (record.timer) {
      clearTimeout(record.timer);
      record.timer = undefined;
      record.remaining = Math.max(0, record.remaining - (Date.now() - record.started));
    }
  }
  resume(id: number, reason = 'manual') {
    const record = this.timers.get(id);
    if (!record) return;
    record.reasons.delete(reason);
    if (record.reasons.size || record.timer) return;
    record.started = Date.now();
    record.timer = setTimeout(() => this.dismiss(id), record.remaining);
  }
}
@Component({
  selector: 'dsy-toast, [dsyToast]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyToast {
  readonly daisy = injectDaisyUIClasses();
  readonly horizontal = input<'start' | 'center' | 'end'>('end');
  readonly vertical = input<'top' | 'middle' | 'bottom'>('bottom');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'toast',
        { start: 'toast-start', center: 'toast-center', end: 'toast-end' }[this.horizontal()],
        { top: 'toast-top', middle: 'toast-middle', bottom: 'toast-bottom' }[this.vertical()],
      ].filter(Boolean),
    ),
  );
}
@Component({
  selector: 'dsy-toast-outlet',
  imports: [DsyToast, DsyAlert],
  template: `@if (service.messages().length) {
    <dsy-toast [horizontal]="horizontal()" [vertical]="vertical()" [class]="toastClass()">
      @for (message of service.messages(); track message.id) {
        <dsy-alert
          [color]="message.color ?? 'info'"
          announcement="off"
          (mouseenter)="service.pause(message.id, 'hover')"
          (mouseleave)="service.resume(message.id, 'hover')"
          (focusin)="service.pause(message.id, 'focus')"
          (focusout)="focusout($event, message.id)"
          ><span>{{ message.text }}</span
          ><button
            type="button"
            [class]="dismissButtonClass()"
            [attr.aria-label]="dismissLabel() + ' ' + message.text"
            (click)="service.dismiss(message.id)"
          >
            ×
          </button></dsy-alert
        >
      }
    </dsy-toast>
  }`,
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyToastOutlet {
  readonly service = inject(DsyToastService);
  readonly horizontal = input<'start' | 'center' | 'end'>('end');
  readonly vertical = input<'top' | 'middle' | 'bottom'>('bottom');
  readonly toastClass = input('');
  readonly dismissLabel = input('Dismiss');
  readonly dismissButtonClass = input('');
  focusout(event: FocusEvent, id: number) {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null))
      this.service.resume(id, 'focus');
  }
}
