import { afterRenderEffect, Directive, ElementRef, inject, input, output } from '@angular/core';
import { DSY_DAISYUI_CONFIG } from 'ngx-daisy/config';
export interface DsyThemeControllerChange {
  theme: string;
  checked: boolean;
}
/** Native checkbox/radio behavior and Angular's built-in forms accessors remain intact. */
@Directive({
  selector: 'input[dsyThemeController]',
  standalone: true,
  host: {
    '[class]': 'className',
    '[value]': 'theme()',
    '[attr.value]': 'theme()',
    '(change)': 'change()',
  },
})
export class DsyThemeController {
  readonly theme = input.required<string>({ alias: 'dsyThemeController' });
  readonly changed = output<DsyThemeControllerChange>();
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  // theme-controller is intentionally exempt from Tailwind's prefix by daisyUI itself.
  protected readonly className = `${inject(DSY_DAISYUI_CONFIG).prefix ?? ''}${'theme-controller'}`;
  constructor() {
    afterRenderEffect(() => {
      if (!['checkbox', 'radio'].includes(this.element.type))
        throw new Error('dsyThemeController requires type="checkbox" or type="radio".');
      if (!this.theme().trim())
        throw new Error('dsyThemeController requires a nonempty theme name.');
    });
  }
  protected change(): void {
    this.changed.emit({ theme: this.theme(), checked: this.element.checked });
  }
}
