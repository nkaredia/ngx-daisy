import { ElementRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
export {};
const runtime = vi.hoisted(() => ({
  ios: true,
  reduced: false,
  animations: [] as {
    cancel: ReturnType<typeof vi.fn>;
    finish(): void;
    fail(): void;
    definition: unknown;
    isPlaying: boolean;
  }[],
}));
vi.mock('@nativescript/core', () => ({
  get isIOS() {
    return runtime.ios;
  },
  Utils: { android: { getApplicationContext: () => ({ getContentResolver: () => ({}) }) } },
}));
beforeEach(() => {
  runtime.ios = true;
  runtime.reduced = false;
  runtime.animations = [];
  vi.stubGlobal('UIAccessibilityIsReduceMotionEnabled', () => runtime.reduced);
});
afterEach(() => vi.unstubAllGlobals());
async function setup(config = {}) {
  vi.resetModules();
  const { DsyMotionController, nativeMotionEnabled, bindNativePresence } =
    await import('./motion/motion');
  const listeners = new Map<string, () => void>();
  const view = {
    visibility: 'visible',
    on: (name: string, callback: () => void) => listeners.set(name, callback),
    off: (name: string) => listeners.delete(name),
    isLoaded: true,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    createAnimation: vi.fn((definition: unknown) => {
      let finish!: () => void;
      let fail!: () => void;
      const promise = new Promise<void>((resolve, reject) => {
        finish = resolve;
        fail = () => reject(new Error('cancelled'));
      });
      const animation = {
        definition,
        isPlaying: true,
        play: () => promise,
        cancel: vi.fn(() => {
          animation.isPlaying = false;
          fail();
        }),
        finish,
        fail,
      };
      runtime.animations.push(animation);
      return animation;
    }),
  };
  return {
    view,
    listeners,
    bindNativePresence,
    motion: new DsyMotionController(view as never, config),
    nativeMotionEnabled,
  };
}
it('honors live iOS Reduce Motion and application opt-out without delaying final state', async () => {
  const { view, motion, nativeMotionEnabled } = await setup();
  runtime.reduced = true;
  expect(nativeMotionEnabled()).toBe(false);
  await motion.to({ opacity: 0, scale: { x: 0.96, y: 0.96 }, translate: { x: 0, y: 8 } });
  expect(view.opacity).toBe(0);
  expect(view.scaleX).toBe(0.96);
  expect(view.translateY).toBe(8);
  expect(view.createAnimation).not.toHaveBeenCalled();
  runtime.reduced = false;
  expect(nativeMotionEnabled()).toBe(true);
  expect(nativeMotionEnabled({ enabled: false })).toBe(false);
  expect(nativeMotionEnabled({ durationScale: 0 })).toBe(false);
});
it('honors Android disabled animator preferences', async () => {
  const { nativeMotionEnabled } = await setup();
  runtime.ios = false;
  const enabled = vi.fn(() => true);
  const scale = vi.fn(() => 1);
  vi.stubGlobal('android', {
    animation: { ValueAnimator: { areAnimatorsEnabled: enabled } },
    provider: { Settings: { Global: { getFloat: scale } } },
  });
  expect(nativeMotionEnabled()).toBe(true);
  enabled.mockReturnValue(false);
  expect(nativeMotionEnabled()).toBe(false);
  enabled.mockReturnValue(true);
  scale.mockReturnValue(0);
  expect(nativeMotionEnabled()).toBe(false);
});
it('cancels replaced animations and rejects stale completions', async () => {
  const { motion } = await setup();
  const first = motion.to({ opacity: 0 });
  const second = motion.to({ opacity: 1 });
  expect(runtime.animations[0].cancel).toHaveBeenCalledOnce();
  runtime.animations[1].finish();
  expect(await first).toBe(false);
  expect(await second).toBe(true);
});
it('scales durations and resolves cancellation without an unhandled rejection', async () => {
  const { motion } = await setup({ durationScale: 0.5 });
  const pending = motion.to({ opacity: 0 }, 180);
  expect(runtime.animations[0].definition).toMatchObject({ duration: 90, curve: 'easeOut' });
  motion.cancel();
  expect(await pending).toBe(false);
});
it('applies final state without starting animations on unloaded views', async () => {
  const { view, motion } = await setup();
  view.isLoaded = false;
  expect(await motion.to({ opacity: 0 })).toBe(true);
  expect(view.opacity).toBe(0);
  expect(view.createAnimation).not.toHaveBeenCalled();
});

it('retains exiting content and prevents a cancelled exit hiding a reopened view', async () => {
  const { view, bindNativePresence } = await setup();
  const opened = signal(false);
  TestBed.configureTestingModule({
    providers: [{ provide: ElementRef, useValue: new ElementRef(view) }],
  });
  const retained = TestBed.runInInjectionContext(() => bindNativePresence(opened));
  TestBed.tick();
  expect(retained()).toBe(false);
  opened.set(true);
  TestBed.tick();
  expect(retained()).toBe(true);
  runtime.animations.at(-1)!.finish();
  await Promise.resolve();
  opened.set(false);
  TestBed.tick();
  expect(retained()).toBe(true);
  const exiting = runtime.animations.at(-1)!;
  opened.set(true);
  TestBed.tick();
  expect(exiting.cancel).toHaveBeenCalledOnce();
  await Promise.resolve();
  expect(retained()).toBe(true);
  runtime.animations.at(-1)!.finish();
  await Promise.resolve();
  opened.set(false);
  TestBed.tick();
  runtime.animations.at(-1)!.finish();
  await Promise.resolve();
  await Promise.resolve();
  expect(retained()).toBe(false);
});

it('falls back to the final visual state if the native animation engine fails', async () => {
  const { view, motion } = await setup();
  const pending = motion.to({ opacity: 1, scale: { x: 1, y: 1 } });
  runtime.animations[0].fail();
  expect(await pending).toBe(true);
  expect(view.opacity).toBe(1);
  expect(view.scaleX).toBe(1);
});

it('slides a drawer panel at full opacity while a separate backdrop can fade', async () => {
  const { view, bindNativePresence } = await setup();
  const opened = signal(false);
  TestBed.configureTestingModule({
    providers: [{ provide: ElementRef, useValue: new ElementRef(view) }],
  });
  const retained = TestBed.runInInjectionContext(() =>
    bindNativePresence(
      opened,
      () => -288,
      () => 0,
      () => false,
    ),
  );
  TestBed.tick();
  opened.set(true);
  TestBed.tick();
  expect(view.opacity).toBe(1);
  expect(view.translateX).toBe(-288);
  expect(runtime.animations.at(-1)!.definition).toMatchObject({
    opacity: 1,
    translate: { x: 0, y: 0 },
  });
  runtime.animations.at(-1)!.finish();
  await Promise.resolve();
  opened.set(false);
  TestBed.tick();
  expect(retained()).toBe(true);
  expect(runtime.animations.at(-1)!.definition).toMatchObject({
    opacity: 1,
    translate: { x: -288, y: 0 },
  });
  runtime.animations.at(-1)!.finish();
  await Promise.resolve();
  await Promise.resolve();
  expect(retained()).toBe(false);
});
