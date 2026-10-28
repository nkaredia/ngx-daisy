import { ElementRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Check, Minus, type IconNode } from 'lucide';

const runtime = vi.hoisted(() => ({
  ios: true,
  image: { original: true },
  nativeSvg: vi.fn(),
  canvas: vi.fn(),
}));
vi.mock('@nativescript/core', () => ({
  get isIOS() {
    return runtime.ios;
  },
  Color: class {},
  ImageSource: class {
    constructor(readonly ios: unknown) {}
    get android() {
      return this.ios;
    }
  },
  Utils: { layout: { toDevicePixels: (value: number) => value * 2 } },
}));
vi.mock('@nativescript-community/ui-svg', () => ({
  getSVGKImage(source: string) {
    runtime.nativeSvg(source);
    return { UIImage: { imageWithRenderingMode: (mode: number) => ({ ...runtime.image, mode }) } };
  },
  getSVG(source: string) {
    runtime.nativeSvg(source);
    return { renderToCanvas: runtime.canvas };
  },
}));

afterEach(() => {
  TestBed.resetTestingModule();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

async function setup(ios = true) {
  runtime.ios = ios;
  vi.resetModules();
  const { bindControlButtonIcon } = await import('./control-icon/control-icon');
  const listeners = new Map<string, () => void>();
  const styleListeners = new Map<string, () => void>();
  const host = {
    isLoaded: true,
    on: (event: string, callback: () => void) => listeners.set(event, callback),
    off: vi.fn(),
    style: {
      color: { r: 10, g: 20, b: 30, a: 128, hex: '#800a141e' },
      on: (event: string, callback: () => void) => styleListeners.set(event, callback),
      off: vi.fn(),
    },
    ios: { setImageForState: vi.fn() },
    android: {
      getForeground: () => null,
      setForeground: vi.fn(),
      getResources: () => ({ getDisplayMetrics: () => ({ densityDpi: 320 }) }),
    },
  };
  const nodes = signal<IconNode | undefined>(Check);
  TestBed.configureTestingModule({
    providers: [{ provide: ElementRef, useValue: { nativeElement: host } }],
  });
  TestBed.runInInjectionContext(() =>
    bindControlButtonIcon(
      () => nodes(),
      () => 20,
    ),
  );
  TestBed.tick();
  return { host, nodes, listeners, styleListeners };
}

it('renders iOS button images in their theme color, updates state and cleans up listeners', async () => {
  const { host, nodes, styleListeners } = await setup();
  await vi.waitFor(() =>
    expect(host.ios.setImageForState).toHaveBeenCalledWith({ original: true, mode: 1 }, 0),
  );
  expect(runtime.nativeSvg.mock.calls[0][0]).toContain('stroke="#0a141e"');
  expect(runtime.nativeSvg.mock.calls[0][0]).toContain(`opacity="${128 / 255}"`);
  nodes.set(Minus);
  TestBed.tick();
  await vi.waitFor(() => expect(runtime.nativeSvg).toHaveBeenCalledTimes(2));
  host.style.color = { r: 255, g: 255, b: 255, a: 255, hex: '#ffffffff' };
  styleListeners.get('colorChange')!();
  await vi.waitFor(() => expect(runtime.nativeSvg).toHaveBeenCalledTimes(3));
  expect(runtime.nativeSvg.mock.lastCall![0]).toContain('stroke="#ffffff"');
  TestBed.resetTestingModule();
  expect(host.style.off).toHaveBeenCalledWith('colorChange', expect.any(Function));
  expect(host.off).toHaveBeenCalledWith('loaded', expect.any(Function));
  expect(host.off).toHaveBeenCalledWith('unloaded', expect.any(Function));
  expect(host.ios.setImageForState).toHaveBeenLastCalledWith(null, 0);
});

it('does not restore an asynchronously loaded icon after a control is cleared or unloaded', async () => {
  const { host, nodes, listeners } = await setup();
  nodes.set(undefined);
  TestBed.tick();
  await vi.waitFor(() => expect(host.ios.setImageForState).toHaveBeenLastCalledWith(null, 0));
  const rendered = runtime.nativeSvg.mock.calls.length;
  host.isLoaded = false;
  listeners.get('unloaded')!();
  nodes.set(Minus);
  TestBed.tick();
  expect(runtime.nativeSvg).toHaveBeenCalledTimes(rendered);
});

it('renders centered density-aware Android foreground icons without modifying button text', async () => {
  const setDensity = vi.fn();
  class Drawable {
    gravity = 0;
    constructor(
      readonly resources: unknown,
      readonly bitmap: unknown,
    ) {}
    setGravity(value: number) {
      this.gravity = value;
    }
  }
  vi.stubGlobal('android', {
    graphics: {
      Bitmap: {
        Config: { ARGB_8888: 1 },
        createBitmap: (width: number, height: number) => ({ width, height, setDensity }),
      },
      Canvas: class {
        constructor(readonly bitmap: unknown) {}
      },
      drawable: { BitmapDrawable: Drawable },
    },
  });
  const { host, nodes } = await setup(false);
  await vi.waitFor(() =>
    expect(host.android.setForeground).toHaveBeenCalledWith(expect.any(Drawable)),
  );
  expect(setDensity).toHaveBeenCalledWith(320);
  expect(host.android.setForeground.mock.lastCall![0]).toMatchObject({
    gravity: 17,
    bitmap: { width: 40, height: 40 },
  });
  expect(runtime.canvas).toHaveBeenCalledOnce();
  nodes.set(undefined);
  TestBed.tick();
  expect(host.android.setForeground).toHaveBeenLastCalledWith(null);
});
