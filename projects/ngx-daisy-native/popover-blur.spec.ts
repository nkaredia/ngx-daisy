export {};
const runtime = vi.hoisted(() => ({
  observers: new Map<string, () => void>(),
  removeObserver: vi.fn(),
}));
vi.mock('@nativescript/core', () => ({
  Color: class {
    constructor(private readonly value: string) {}
    get ios() {
      return { colorWithAlphaComponent: (alpha: number) => ({ color: this.value, alpha }) };
    }
  },
  Application: {
    ios: {
      addNotificationObserver(name: string, callback: () => void) {
        runtime.observers.set(name, callback);
        return callback;
      },
      removeNotificationObserver: runtime.removeObserver,
    },
  },
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  runtime.observers.clear();
});

async function setup(reduceTransparency = false, increaseContrast = false) {
  vi.resetModules();
  const { attachPopoverBlur } = await import('./popover/popover.blur');
  const preferences = { reduceTransparency, increaseContrast };
  const effect = {
    frame: undefined as unknown,
    autoresizingMask: 0,
    effect: undefined as unknown,
    contentView: { backgroundColor: undefined as unknown },
    hidden: false,
    clipsToBounds: false,
    layer: { cornerRadius: 0 },
    userInteractionEnabled: true,
    isAccessibilityElement: true,
    accessibilityElementsHidden: false,
    removeFromSuperview: vi.fn(),
  };
  const host = {
    bounds: { width: 280, height: 360 },
    layer: { cornerRadius: 16 },
    insertSubviewAtIndex: vi.fn(),
    sendSubviewToBack: vi.fn(),
  };
  const createMaterial = vi.fn((style: number) => ({ style }));
  vi.stubGlobal('UIVisualEffectView', { alloc: () => ({ initWithEffect: () => effect }) });
  vi.stubGlobal('UIBlurEffect', { effectWithStyle: createMaterial });
  vi.stubGlobal('UIAccessibilityIsReduceTransparencyEnabled', () => preferences.reduceTransparency);
  vi.stubGlobal('UIAccessibilityDarkerSystemColorsEnabled', () => preferences.increaseContrast);
  vi.stubGlobal('UIAccessibilityReduceTransparencyStatusDidChangeNotification', 'transparency');
  vi.stubGlobal('UIAccessibilityDarkerSystemColorsStatusDidChangeNotification', 'contrast');
  return {
    effect,
    host,
    preferences,
    createMaterial,
    blur: attachPopoverBlur(host, 'light', 'white'),
  };
}

it('confines material to the rounded panel and leaves content, input and accessibility sharp', async () => {
  const { effect, host, blur } = await setup();
  expect(effect.effect).toEqual({ style: 12 });
  expect(effect.contentView.backgroundColor).toEqual({ color: 'white', alpha: 0.15 });
  expect(effect.userInteractionEnabled).toBe(false);
  expect(effect.isAccessibilityElement).toBe(false);
  expect(effect.accessibilityElementsHidden).toBe(true);
  expect(host.insertSubviewAtIndex).toHaveBeenCalledWith(effect, 0);
  expect(effect.frame).toEqual(host.bounds);
  expect(effect.layer.cornerRadius).toBe(16);
  expect(effect.clipsToBounds).toBe(true);
  host.bounds = { width: 320, height: 280 };
  host.layer.cornerRadius = 24;
  blur.layout();
  expect(effect.frame).toEqual(host.bounds);
  expect(effect.layer.cornerRadius).toBe(24);
  expect(host.sendSubviewToBack).toHaveBeenLastCalledWith(effect);
  blur.setScheme('dark');
  expect(effect.effect).toEqual({ style: 17 });
  blur.setSurfaceColor('navy');
  expect(effect.contentView.backgroundColor).toEqual({ color: 'navy', alpha: 0.15 });
  blur.setCovered(true);
  expect(effect.hidden).toBe(true);
  blur.setCovered(false);
  expect(effect.hidden).toBe(false);
  blur.dispose();
});

it.each([
  [true, false],
  [false, true],
  [true, true],
])(
  'uses an opaque theme surface for accessibility preferences (%s, %s)',
  async (transparency, contrast) => {
    const { effect, createMaterial, blur } = await setup(transparency, contrast);
    expect(createMaterial).not.toHaveBeenCalled();
    expect(effect.effect).toBeNull();
    expect(effect.contentView.backgroundColor).toEqual({ color: 'white', alpha: 1 });
    blur.setSurfaceColor('navy');
    expect(effect.contentView.backgroundColor).toEqual({ color: 'navy', alpha: 1 });
    blur.dispose();
  },
);

it('updates live preferences and releases native observers and the view on dismissal', async () => {
  const { effect, preferences, createMaterial, blur } = await setup();
  const transparencyChanged = runtime.observers.get('transparency')!;
  const contrastChanged = runtime.observers.get('contrast')!;
  preferences.reduceTransparency = true;
  transparencyChanged();
  expect(effect.effect).toBeNull();
  preferences.reduceTransparency = false;
  preferences.increaseContrast = true;
  contrastChanged();
  expect(effect.effect).toBeNull();
  preferences.increaseContrast = false;
  contrastChanged();
  expect(effect.effect).toEqual({ style: 12 });
  expect(effect.contentView.backgroundColor).toEqual({ color: 'white', alpha: 0.15 });
  blur.dispose();
  blur.dispose();
  expect(runtime.removeObserver).toHaveBeenCalledTimes(2);
  expect(runtime.removeObserver).toHaveBeenCalledWith(transparencyChanged, 'transparency');
  expect(runtime.removeObserver).toHaveBeenCalledWith(contrastChanged, 'contrast');
  expect(effect.removeFromSuperview).toHaveBeenCalledExactlyOnceWith();
  createMaterial.mockClear();
  transparencyChanged();
  expect(createMaterial).not.toHaveBeenCalled();
});
