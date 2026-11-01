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
  template: `
    <StackLayout>
      <Label
        class="text-[15px] opacity-75 mb-4"
        text="The ngx-daisy design language, rendered with real native controls. Pick a theme and explore."
        textWrap="true"
      ></Label>

      <StackLayout class="bg-base-200 border-base-300 border rounded-box p-5 mt-2 mb-4">
        <Label text="YOUR NEXT ADVENTURE" class="text-[11px] font-bold text-primary mb-2"></Label>
        <Label
          text="Weekend essentials"
          class="text-[22px] font-bold mb-2"
          accessibilityRole="header"
        ></Label>
        <Label text="Everyday backpack · Sand" class="text-[15px] opacity-75 mb-4"></Label>
        <GridLayout columns="*, auto" class="mt-1 mb-5">
          <Label text="Ready to ship" class="opacity-65"></Label>
          <Label col="1" text="$89.00" class="text-[22px] font-bold"></Label>
        </GridLayout>
        <Button
          dsyButton
          text="Place order"
          dsyColor="primary"
          dsyLayout="block"
          [loading]="saving()"
          loadingText="Placing order…"
          (pressed)="placeOrder()"
        ></Button>
        <Label
          [text]="confirmation()"
          class="text-[13px] mt-3"
          textWrap="true"
          accessibilityLiveRegion="polite"
        ></Label>
      </StackLayout>

      <Label
        text="Semantic colors"
        class="text-[19px] font-semibold mt-5 mb-3"
        accessibilityRole="header"
      ></Label>
      <Label
        text="One intent, a consistent color across platforms."
        class="text-[15px] opacity-75 mb-4"
        textWrap="true"
      ></Label>
      <GridLayout columns="*, *" rows="auto, auto, auto, auto" class="color-grid">
        @for (color of colors; track color; let index = $index) {
          <Button
            dsyButton
            [text]="color"
            [dsyColor]="color"
            [row]="index / 2 - ((index / 2) % 1)"
            [col]="index % 2"
            dsyLayout="block"
            margin="6"
            (pressed)="countPress()"
          ></Button>
        }
      </GridLayout>

      <Label
        text="Different emphasis"
        class="text-[19px] font-semibold mt-5 mb-3"
        accessibilityRole="header"
      ></Label>
      <StackLayout class="bg-base-200 border-base-300 border rounded-box p-5 mt-2 mb-4">
        @for (variant of variants; track variant) {
          <Button
            dsyButton
            [text]="variant"
            dsyColor="primary"
            [variant]="variant"
            dsyLayout="block"
            margin="6"
            (pressed)="countPress()"
          ></Button>
        }
      </StackLayout>

      <Label
        text="Sizes and states"
        class="text-[19px] font-semibold mt-5 mb-3"
        accessibilityRole="header"
      ></Label>
      <StackLayout class="bg-base-200 border-base-300 border rounded-box p-5 mt-2 mb-4">
        @for (size of sizes; track size) {
          <Button
            dsyButton
            [text]="size"
            [size]="size"
            dsyColor="secondary"
            margin="6"
            (pressed)="countPress()"
          ></Button>
        }
        <Button dsyButton text="Unavailable" disabled dsyLayout="block" margin="6"></Button>
        <Button
          dsyButton
          text="Selected"
          active
          dsyColor="accent"
          dsyLayout="block"
          margin="6"
          (pressed)="countPress()"
        ></Button>
        <GridLayout columns="*, *">
          <Button
            col="0"
            dsyButton
            text="+"
            shape="circle"
            dsyColor="primary"
            accessibilityLabel="Add item"
            (pressed)="countPress()"
          ></Button>
          <Button
            col="1"
            dsyButton
            text="+"
            shape="square"
            variant="outline"
            dsyColor="primary"
            accessibilityLabel="Add another item"
            (pressed)="countPress()"
          ></Button>
        </GridLayout>
      </StackLayout>
      <Label
        [text]="'Button activations: ' + activations()"
        class="text-center my-5 text-[13px] opacity-65"
        accessibilityLiveRegion="polite"
      ></Label>
    </StackLayout>
  `,
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
