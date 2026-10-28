import {
  DSY_MOTION_CONFIG,
  DsyMotionController,
  nativeMotionEnabled,
} from '@ngx-daisy/native/motion';
import { isAndroid, type View } from '@nativescript/core';
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
import { DsyButtonIcon } from '@ngx-daisy/native/control-icon';
import { X } from 'lucide';
import { NgTemplateOutlet } from '@angular/common';
import { NATIVE_DIALOG_DATA, NativeDialog, NativeDialogRef } from '@nativescript/angular';
import type { NativeDialogConfig } from '@nativescript/angular';
import { DSY_LIGHT_THEME, DsyTheme, type DsyThemeDefinition } from '@ngx-daisy/native/theme';
import { take } from 'rxjs';
import { ensureModalPanel } from './modal.panel';
import { configureModalFade } from './modal.fade';

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
  imports: [NgTemplateOutlet, DsyTheme, DsyButton, DsyButtonIcon],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<DsyModalRoot
    [dsyTheme]="theme()"
    [dismissMotion]="dismissMotion"
    class="dsy-native-modal-root"
    [class.dsy-native-modal-android]="android"
    [width]="android ? width() + 32 : '100%'"
    [height]="android ? 'auto' : '100%'"
    (layoutChanged)="onLayout($event)"
    (showingModally)="onPresenting($event)"
    (loaded)="onPresenting($event)"
  >
    @if (!android) {
      <Button
        text=""
        backgroundColor="transparent"
        borderWidth="0"
        width="100%"
        height="100%"
        accessible="false"
        [isEnabled]="!data.config.disableClose"
        (tap)="dismissOutside()"
      ></Button>
    }
    <DsyModalPanel
      opacity="0"
      (loaded)="onPanelLoaded($event)"
      (unloaded)="panelMotion?.cancel()"
      verticalAlignment="middle"
      horizontalAlignment="center"
      [width]="width()"
      [maxHeight]="maxHeight()"
      class="dsy-native-modal-surface"
      [class]="data.config.panelClass ?? ''"
    >
      <ScrollView>
        <StackLayout class="dsy-native-modal">
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
              text=""
              [dsyControlIcon]="closeIcon"
              shape="circle"
              size="sm"
              variant="ghost"
              accessibilityLabel="Close dialog"
              (pressed)="close()"
            ></Button>
          </GridLayout>
          <ng-container [ngTemplateOutlet]="data.template" [ngTemplateOutletContext]="context" />
        </StackLayout>
      </ScrollView>
    </DsyModalPanel>
  </DsyModalRoot>`,
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNativeModalSurface {
  constructor() {
    ensureModalPanel();
  }
  private readonly motion = inject(DSY_MOTION_CONFIG);
  panelMotion?: DsyMotionController;
  onPanelLoaded(raw: unknown): void {
    const panel = (raw as { object: View }).object;
    this.panelMotion?.cancel();
    const enabled = this.data.config.nativeOptions?.animated !== false;
    this.panelMotion = new DsyMotionController(panel, {
      ...this.motion,
      enabled: enabled && this.motion.enabled !== false,
    });
    panel.opacity = 0;
    panel.scaleX = panel.scaleY = 0.94;
    void this.panelMotion.to({ opacity: 1, scale: { x: 1, y: 1 } }, 180);
  }
  readonly dismissMotion = () =>
    this.panelMotion?.to({ opacity: 0, scale: { x: 0.94, y: 0.94 } }, 120);

  onPresenting(raw: unknown): void {
    const host = (raw as { object?: Parameters<typeof configureModalFade>[0] }).object;
    if (host)
      configureModalFade(
        host,
        nativeMotionEnabled(this.motion) && this.data.config.nativeOptions?.animated !== false,
      );
  }
  readonly closeIcon = X;
  readonly android = isAndroid;
  private readonly viewport = signal({ width: 360, height: 720 });
  readonly width = computed(() =>
    Math.max(1, Math.min(this.data.config.width ?? 320, this.viewport().width - 32)),
  );
  readonly maxHeight = computed(() => Math.max(1, Math.min(560, this.viewport().height - 96)));
  onLayout(raw: unknown): void {
    if (this.android) return;
    const size = (
      raw as { object?: { getActualSize?(): { width: number; height: number } } }
    ).object?.getActualSize?.();
    if (
      size &&
      size.width > 0 &&
      size.height > 0 &&
      (size.width !== this.viewport().width || size.height !== this.viewport().height)
    )
      this.viewport.set(size);
  }
  dismissOutside(): void {
    if (!this.data.config.disableClose) this.close();
  }

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
/** Shared compact native dialog presentation. Menus use their own anchored presenter. */
@Injectable({ providedIn: 'root' })
export class DsyModalService {
  private readonly dialogs = inject(NativeDialog);
  private readonly motion = inject(DSY_MOTION_CONFIG);
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
      nativeOptions: {
        fullscreen: false,
        stretched: false,
        ...config.nativeOptions,
        animated: nativeMotionEnabled(this.motion) && config.nativeOptions?.animated !== false,
        ios: { presentationStyle: 5, ...config.nativeOptions?.ios },
      },
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
