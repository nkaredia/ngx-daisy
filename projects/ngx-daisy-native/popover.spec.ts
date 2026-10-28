import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { View } from '@nativescript/core';
import { lastValueFrom } from 'rxjs';
import { DsyPopoverService } from './popover/popover.service';
import { positionPopover } from './popover/position';
const runtime = vi.hoisted(() => ({
  root: undefined as unknown,
  generated: undefined as unknown,
  on: vi.fn(),
  off: vi.fn(),
}));
vi.mock('@nativescript/core', () => ({
  GridLayout: class GridLayout {},
  CSSType: () => () => {},
  AbsoluteLayout: class AbsoluteLayout {},
  isIOS: false,
  getRootLayout: () => runtime.root,
  Application: { on: runtime.on, off: runtime.off, android: { on: runtime.on, off: runtime.off } },
}));
vi.mock('@nativescript/angular', () => ({
  registerElement: vi.fn(),
  generateNativeScriptView: () => runtime.generated,
}));
function setup() {
  const listeners = new Map<string, () => void>();
  const background = { accessibilityHidden: false };
  const root = {
    eachChild: (callback: (view: unknown) => void) => callback(background),
    open: vi.fn(async () => {
      layer.parent = root;
    }),
    close: vi.fn(async () => {
      layer.parent = undefined;
    }),
    removeChild: vi.fn(),
  };
  const layer = {
    focus: vi.fn(),
    parent: undefined as unknown,
    isUserInteractionEnabled: true,
    accessibilityHidden: false,
  };
  const destroy = vi.fn();
  runtime.root = root;
  runtime.generated = {
    firstNativeLikeView: layer,
    ref: {
      instance: { reposition: vi.fn() },
      changeDetectorRef: { detectChanges: vi.fn() },
      destroy,
    },
  };
  const anchor = {
    isLoaded: true,
    on: vi.fn((name: string, callback: () => void) => listeners.set(name, callback)),
    off: vi.fn(),
    focus: vi.fn(),
  };
  TestBed.configureTestingModule({
    providers: [{ provide: ErrorHandler, useValue: { handleError: vi.fn() } }],
  });
  return {
    root,
    background,
    layer,
    anchor: anchor as unknown as View,
    focus: anchor.focus,
    listeners,
    destroy,
    service: TestBed.inject(DsyPopoverService),
  };
}
it('flips above an anchor near the bottom and clamps a wide panel to the viewport', () => {
  const result = positionPopover(
    { x: 260, y: 580, width: 80, height: 44 },
    { width: 360, height: 640 },
    { width: 500, contentHeight: 220 },
  );
  expect(result.side).toBe('top');
  expect(result.width).toBe(336);
  expect(result.left).toBe(12);
  expect(result.top).toBe(354);
});
it('bounds a long menu to available space while keeping an end-aligned panel attached', () => {
  const result = positionPopover(
    { x: 150, y: 80, width: 120, height: 44 },
    { width: 320, height: 400 },
    { width: 220, contentHeight: 900, align: 'end' },
  );
  expect(result).toMatchObject({ side: 'bottom', left: 50, top: 130, width: 220, maxHeight: 258 });
});
it('restores background accessibility and anchor focus, destroying the content once', async () => {
  const fixture = setup();
  const ref = fixture.service.open(fixture.anchor, class Content {});
  await ref.opened;
  expect(fixture.background.accessibilityHidden).toBe(true);
  ref.close();
  ref.close();
  expect(await lastValueFrom(ref.closed)).toBe('dismiss');
  expect(fixture.destroy).toHaveBeenCalledTimes(1);
  expect(fixture.root.close).toHaveBeenCalledTimes(1);
  expect(fixture.background.accessibilityHidden).toBe(false);
  expect(fixture.focus).toHaveBeenCalledTimes(1);
  expect(fixture.anchor.off).toHaveBeenCalledWith('unloaded', expect.any(Function));
});
it('cancels before presentation without mounting or leaking a native layer', async () => {
  const fixture = setup();
  const ref = fixture.service.open(fixture.anchor, class Content {});
  ref.close('owner');
  await ref.opened;
  expect(await lastValueFrom(ref.closed)).toBe('owner');
  expect(fixture.root.open).not.toHaveBeenCalled();
  expect(fixture.focus).not.toHaveBeenCalled();
});
it('closes on anchor unload without restoring focus to an obsolete page', async () => {
  const fixture = setup();
  const ref = fixture.service.open(fixture.anchor, class Content {});
  await ref.opened;
  fixture.listeners.get('unloaded')!();
  expect(await lastValueFrom(ref.closed)).toBe('owner');
  expect(fixture.focus).not.toHaveBeenCalled();
});
it('waits for an opening layer before removing it when cancellation arrives during presentation', async () => {
  const fixture = setup();
  let finishOpening!: () => void;
  fixture.root.open.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        fixture.layer.parent = fixture.root;
        finishOpening = resolve;
      }),
  );
  const ref = fixture.service.open(fixture.anchor, class Content {});
  await Promise.resolve();
  ref.close('owner');
  expect(fixture.root.close).not.toHaveBeenCalled();
  finishOpening();
  await ref.opened;
  expect(await lastValueFrom(ref.closed)).toBe('owner');
  expect(fixture.root.close).toHaveBeenCalledTimes(1);
  expect(fixture.destroy).toHaveBeenCalledTimes(1);
});
