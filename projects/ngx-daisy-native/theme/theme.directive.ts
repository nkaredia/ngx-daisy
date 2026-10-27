import {
  Directive,
  ElementRef,
  Renderer2,
  RendererStyleFlags2,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import type { View } from '@nativescript/core';
import type { DsyThemeDefinition } from '@ngx-daisy/core/theme';
import { resolveNativeTheme } from './native-theme';

/** Apply to a native layout or Page; descendants inherit its theme variables. */
@Directive({ selector: '[dsyTheme]', standalone: true })
export class DsyTheme {
  readonly theme = input.required<DsyThemeDefinition>({ alias: 'dsyTheme' });
  readonly rootFontSize = input(16);
  private readonly host = inject<ElementRef<View>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  readonly resolved = computed(() =>
    resolveNativeTheme(this.theme(), { rootFontSize: this.rootFontSize() }),
  );

  constructor() {
    effect(() => {
      // NativeScript's renderer refreshes descendant CSS when custom properties change.
      for (const [name, value] of Object.entries(this.resolved().tokens))
        this.renderer.setStyle(this.host, name, value, RendererStyleFlags2.DashCase);
    });
  }
}
