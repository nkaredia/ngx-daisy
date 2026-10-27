import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  DestroyRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  effect,
  input,
  model,
  output,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/native/button';
/** Put this layout in a native GridLayout overlay slot for floating placement. */
@Component({
  selector: 'StackLayout[dsyFab]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '<ng-content />',
  styleUrl: './fab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'dsyFab',
  host: { class: 'dsy-native-fab' },
})
export class DsyFab {
  constructor() {
    effect(() => {
      if (this.disabled()) this.opened.set(false);
    });
  }
  readonly opened = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  open(): void {
    if (!this.disabled()) this.opened.set(true);
  }
  close(): void {
    this.opened.set(false);
  }
  toggle(): void {
    if (!this.disabled()) this.opened.update((value) => !value);
  }
}
@Directive({
  selector: 'Button[dsyFabTrigger]',
  standalone: true,
  host: {
    '(tap)': 'activate()',
    '[attr.isEnabled]': '!fab.disabled() && !button?.isDisabled()',
    '[attr.accessibilityHint]': 'fab.opened() ? "Closes quick actions" : "Opens quick actions"',
  },
})
export class DsyFabTrigger {
  constructor() {
    const remove = this.button?.registerDisabledSource(() => this.fab.disabled());
    if (remove) inject(DestroyRef).onDestroy(remove);
  }

  readonly fab = inject(DsyFab);
  readonly button = inject(DsyButton, { optional: true });
  activate(): void {
    if (!this.button?.isDisabled()) this.fab.toggle();
  }
}
@Directive({
  selector: 'Button[dsyFabAction]',
  standalone: true,
  host: {
    '(tap)': 'activate()',
    '[attr.visibility]': 'fab.opened() && !fab.disabled() ? "visible" : "collapse"',
    '[attr.isEnabled]': 'fab.opened() && !fab.disabled() && !disabled() && !button?.isDisabled()',
    '[attr.accessibilityHidden]': '!fab.opened() || fab.disabled()',
  },
})
export class DsyFabAction {
  constructor() {
    const remove = this.button?.registerDisabledSource(
      () => this.disabled() || this.fab.disabled() || !this.fab.opened(),
    );
    if (remove) inject(DestroyRef).onDestroy(remove);
  }

  readonly fab = inject(DsyFab);
  readonly button = inject(DsyButton, { optional: true });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly triggered = output<void>();
  activate(): void {
    if (!this.fab.opened() || this.fab.disabled() || this.disabled() || this.button?.isDisabled())
      return;
    this.fab.close();
    this.triggered.emit();
  }
}
@Directive({
  selector: 'Button[dsyFabClose]',
  standalone: true,
  host: {
    '(tap)': 'fab.close()',
    '[attr.visibility]': 'fab.opened() && !fab.disabled() ? "visible" : "collapse"',
  },
})
export class DsyFabClose {
  readonly fab = inject(DsyFab);
}
