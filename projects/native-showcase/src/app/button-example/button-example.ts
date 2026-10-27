import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import {
  DsyButton,
  type DsyButtonColor,
  type DsyButtonSize,
  type DsyNativeButtonVariant,
} from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-button-example',
  standalone: true,
  imports: [NativeScriptCommonModule, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './button-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeButtonExample {
  readonly saving = signal(false);
  readonly confirmation = signal('Your order is ready when you are.');
  readonly activations = signal(0);
  readonly colors: readonly DsyButtonColor[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ];
  readonly sizes: readonly DsyButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  readonly variants: readonly DsyNativeButtonVariant[] = [
    'solid',
    'outline',
    'soft',
    'ghost',
    'link',
  ];
  private timer?: ReturnType<typeof setTimeout>;
  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }
  countPress(): void {
    this.activations.update((count) => count + 1);
  }
  placeOrder(): void {
    this.saving.set(true);
    this.confirmation.set('Confirming your order…');
    this.timer = setTimeout(() => {
      this.saving.set(false);
      this.confirmation.set('Order confirmed. Thanks for shopping with us!');
    }, 1800);
  }
}
