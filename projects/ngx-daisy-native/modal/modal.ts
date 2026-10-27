import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  Injectable,
  NO_ERRORS_SCHEMA,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  computed,
  booleanAttribute,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/native/button';
import { NgTemplateOutlet } from '@angular/common';
import { NATIVE_DIALOG_DATA, NativeDialog, NativeDialogRef } from '@nativescript/angular';
import type { NativeDialogConfig } from '@nativescript/angular';
import { DSY_LIGHT_THEME, DsyTheme, type DsyThemeDefinition } from '@ngx-daisy/native/theme';
import { take } from 'rxjs';

export interface DsyModalHandle<R = unknown> {
  close(result?: R): void;
}
export interface DsyModalContext<D = unknown, R = unknown> {
  readonly $implicit: DsyModalHandle<R>;
  readonly data: D | undefined;
}
export interface DsyModalConfig<D = unknown> {
  readonly data?: D;
  readonly theme?: DsyThemeDefinition | (() => DsyThemeDefinition);
  readonly label?: string;
  readonly panelClass?: string;
  readonly width?: number;
  readonly disableClose?: boolean;
  readonly viewContainerRef?: ViewContainerRef;
  readonly nativeOptions?: NativeDialogConfig['nativeOptions'];
}
interface SurfaceData {
  template: TemplateRef<DsyModalContext>;
  config: DsyModalConfig;
}
/** Internal shared surface; native presentation owns focus, back and dismissal. */
@Component({
  selector: 'dsy-native-modal-surface',
  standalone: true,
  imports: [NgTemplateOutlet, DsyTheme, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<GridLayout
    [dsyTheme]="theme()"
    class="dsy-native-modal-root"
    width="100%"
    height="100%"
  >
    <ScrollView
      ><StackLayout
        class="dsy-native-modal"
        [class]="data.config.panelClass ?? ''"
        [width]="data.config.width ?? 320"
        horizontalAlignment="center"
      >
        <GridLayout columns="*, auto" marginBottom="16">
          <Label
            [text]="data.config.label ?? 'Dialog'"
            fontSize="18"
            fontWeight="600"
            verticalAlignment="middle"
            textWrap="true"
            accessibilityRole="header"
          ></Label>
          <Button
            col="1"
            dsyButton
            text="×"
            shape="circle"
            size="sm"
            variant="ghost"
            accessibilityLabel="Close dialog"
            (pressed)="close()"
          ></Button>
        </GridLayout>
        <ng-container
          [ngTemplateOutlet]="data.template"
          [ngTemplateOutletContext]="context"
        /> </StackLayout
    ></ScrollView>
  </GridLayout>`,
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNativeModalSurface {
  readonly data = inject<SurfaceData>(NATIVE_DIALOG_DATA);
  readonly ref = inject<NativeDialogRef<unknown>>(NativeDialogRef);
  readonly context: DsyModalContext = {
    $implicit: { close: (result) => this.close(result) },
    data: this.data.config.data,
  };
  close(result?: unknown): void {
    // NativeDialogState.OPEN is 0; repeated native close calls can overwrite results.
    if (this.ref.getState() === 0) this.ref.close(result);
  }
  readonly theme = computed(() => {
    const theme = this.data.config.theme;
    return typeof theme === 'function' ? theme() : (theme ?? DSY_LIGHT_THEME);
  });
}
/** Shared themed native presentation, also used by Dropdown. */
@Injectable({ providedIn: 'root' })
export class DsyModalService {
  private readonly dialogs = inject(NativeDialog);
  open<D = unknown, R = unknown>(
    template: TemplateRef<DsyModalContext<D, R>>,
    config: DsyModalConfig<D> = {},
  ): NativeDialogRef<unknown, R> {
    return this.dialogs.open<DsyNativeModalSurface, SurfaceData, R>(DsyNativeModalSurface, {
      data: { template: template as TemplateRef<DsyModalContext>, config },
      viewContainerRef: config.viewContainerRef,
      // Template anchors are comment nodes, not native presentation hosts.
      renderIn: 'root',
      disableClose: config.disableClose ?? false,
      nativeOptions: { animated: false, ...config.nativeOptions },
    });
  }
}
/** A template-backed modal. Each opening creates fresh content. */
@Directive({ selector: 'ng-template[dsyModal]', standalone: true, exportAs: 'dsyModal' })
export class DsyModal {
  readonly opened = model(false);
  readonly disableClose = input(false, { transform: booleanAttribute });
  readonly label = input('Dialog');
  readonly panelClass = input('');
  readonly panelWidth = input(320);
  readonly closed = output<unknown>();
  private readonly template = inject<TemplateRef<DsyModalContext>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);
  private readonly scope = inject(DsyTheme, { optional: true });
  private readonly service = inject(DsyModalService);
  private readonly ref = signal<NativeDialogRef<unknown> | undefined>(undefined);
  constructor() {
    const destroyRef = inject(DestroyRef);
    effect(() => {
      const opened = this.opened();
      const ref = this.ref();
      if (opened && !ref) {
        const next = this.service.open(this.template, {
          label: this.label(),
          panelClass: this.panelClass(),
          width: this.panelWidth(),
          disableClose: this.disableClose(),
          theme: this.scope?.theme,
          viewContainerRef: this.container,
        });
        this.ref.set(next);
        next
          .afterClosed()
          .pipe(take(1), takeUntilDestroyed(destroyRef))
          .subscribe((result) => {
            this.opened.set(false);
            this.ref.set(undefined);
            this.closed.emit(result);
          });
      } else if (!opened && ref) {
        if (ref.getState() === 0) ref.close();
      }
    });
    destroyRef.onDestroy(() => {
      const ref = this.ref();
      if (ref?.getState() === 0) ref.close();
    });
  }
  open(): void {
    this.opened.set(true);
  }
  close(result?: unknown): void {
    const ref = this.ref();
    if (!ref) this.opened.set(false);
    else if (ref.getState() === 0) ref.close(result);
  }
  toggle(): void {
    this.opened.update((value) => !value);
  }
  static ngTemplateContextGuard(
    _directive: DsyModal,
    context: unknown,
  ): context is DsyModalContext {
    return true;
  }
}
