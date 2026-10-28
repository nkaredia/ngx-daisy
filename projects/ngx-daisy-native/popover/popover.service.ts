import { ComponentRef, ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { Application, getRootLayout, type View } from '@nativescript/core';
import { generateNativeScriptView } from '@nativescript/angular';
import { ReplaySubject } from 'rxjs';
import { DSY_POPOVER_DATA, DsyNativePopoverSurface } from './popover.surface';
import type {
  DsyPopoverCloseReason,
  DsyPopoverConfig,
  DsyPopoverContent,
  DsyPopoverRef,
} from './popover.types';
/** App-root view layers, never NativeDialog or an OS menu. */
@Injectable({ providedIn: 'root' })
export class DsyPopoverService {
  private readonly injector = inject(Injector);
  private readonly errors = inject(ErrorHandler);
  private active?: { ref: DsyPopoverRef; finished: Promise<void> };
  /** Call before app-level Android Back navigation. */
  closeActive(): boolean {
    if (!this.active) return false;
    this.active.ref.close();
    return true;
  }
  open(anchor: View, content: DsyPopoverContent, config: DsyPopoverConfig = {}): DsyPopoverRef {
    const root = getRootLayout();
    if (!root || !anchor.isLoaded)
      throw new Error('A popover requires a loaded anchor inside a NativeScript RootLayout.');
    const previous = this.active;
    previous?.ref.close('superseded');
    const closed = new ReplaySubject<DsyPopoverCloseReason>(1);
    let finishPromise!: () => void;
    const finished = new Promise<void>((resolve) => (finishPromise = resolve));
    let reason: DsyPopoverCloseReason | undefined;
    let complete = false;
    let mounted = false;
    let opening = false;
    let disposing = false;
    let surface: ComponentRef<DsyNativePopoverSurface> | undefined;
    let layer: View | undefined;
    const cleanups: (() => void)[] = [];
    const background: { view: View; hidden: boolean }[] = [];
    const finish = () => {
      if (complete) return;
      complete = true;
      for (const cleanup of cleanups.splice(0)) cleanup();
      for (const entry of background) entry.view.accessibilityHidden = entry.hidden;
      surface?.destroy();
      if (this.active?.ref === ref) this.active = undefined;
      if (
        config.restoreFocus !== false &&
        anchor.isLoaded &&
        reason !== 'owner' &&
        reason !== 'superseded' &&
        reason !== 'error'
      )
        anchor.focus();
      closed.next(reason ?? 'dismiss');
      closed.complete();
      finishPromise();
    };
    const dispose = () => {
      if (disposing || complete || opening) return;
      disposing = true;
      if (mounted && layer?.parent === root) {
        root.close(layer).then(finish, (error) => {
          this.errors.handleError(error);
          if (layer?.parent === root) root.removeChild(layer);
          finish();
        });
      } else finish();
    };
    const close = (next: DsyPopoverCloseReason = 'dismiss') => {
      if (reason || complete) return;
      reason = next;
      if (layer) {
        layer.isUserInteractionEnabled = false;
        layer.accessibilityHidden = true;
      }
      dispose();
    };
    const listen = (view: Pick<View, 'on' | 'off'>, event: string, callback: () => void) => {
      view.on(event, callback);
      cleanups.push(() => view.off(event, callback));
    };
    const opened = (async () => {
      await previous?.finished;
      if (complete) return;
      opening = true;
      try {
        const injector = Injector.create({
          parent: config.injector ?? this.injector,
          providers: [{ provide: DSY_POPOVER_DATA, useValue: { content, config, close } }],
        });
        const generated = generateNativeScriptView(DsyNativePopoverSurface, { injector });
        surface = generated.ref as ComponentRef<DsyNativePopoverSurface>;
        surface.instance.anchor = anchor;
        layer = generated.firstNativeLikeView;
        root.eachChild((child) => {
          const view = child as View;
          background.push({ view, hidden: view.accessibilityHidden });
          view.accessibilityHidden = true;
          return true;
        });
        listen(anchor, 'unloaded', () => close('owner'));
        listen(anchor, 'layoutChanged', () => surface?.instance.reposition());
        for (let parent = anchor.parent; parent; parent = parent.parent)
          listen(parent, 'scroll', () => close('owner'));
        if (anchor.page) listen(anchor.page, 'navigatingFrom', () => close('owner'));
        const suspend = () => close('owner');
        Application.on('suspend', suspend);
        cleanups.push(() => Application.off('suspend', suspend));
        if (Application.android) {
          const back = (args: { cancel?: boolean }) => {
            args.cancel = true;
            close();
          };
          Application.android.on('activityBackPressed', back);
          cleanups.push(() => Application.android.off('activityBackPressed', back));
        }
        mounted = true;
        await root.open(layer, { animation: { enterFrom: { opacity: 1, duration: 0 } } });
        opening = false;
        if (reason) {
          dispose();
          return;
        }
        surface.instance.reposition();
        surface.changeDetectorRef.detectChanges();
        if (layer.ios)
          (layer.ios as { accessibilityViewIsModal: boolean }).accessibilityViewIsModal = true;
        layer.focus();
        config.initialFocus?.()?.focus();
      } catch (error) {
        opening = false;
        this.errors.handleError(error);
        if (!reason) reason = 'error';
        dispose();
      }
    })();
    const ref: DsyPopoverRef = { close, closed: closed.asObservable(), opened };
    this.active = { ref, finished };
    return ref;
  }
}
