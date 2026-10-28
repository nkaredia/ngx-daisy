const runtime = vi.hoisted(() => ({
  observers: new Map<string, () => void>(),
  removeObserver: vi.fn(),
}));
vi.mock('@nativescript/core', () => ({
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
import { attachPopoverBlur } from './popover/popover.blur';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  runtime.observers.clear();
});

function setup(reduceTransparency = false, increaseContrast = false) {
  const preferences = { reduceTransparency, increaseContrast };
  const effect = {
    frame: undefined as unknown,
    autoresizingMask: 0,
    effect: undefined as unknown,
    backgroundColor: undefined as unknown,
    userInteractionEnabled: true,
    isAccessibilityElement: true,
    accessibilityElementsHidden: false,
    removeFromSuperview: vi.fn(),
  };
  const host = {
    bounds: { width: 390, height: 844 },
    insertSubviewAtIndex: vi.fn(),
    sendSubviewToBack: vi.fn(),
  };
  const createMaterial = vi.fn((style: number) => ({ style }));
  vi.stubGlobal('UIVisualEffectView', { alloc: () => ({ initWithEffect: () => effect }) });
  vi.stubGlobal('UIBlurEffect', { effectWithStyle: createMaterial });
  vi.stubGlobal('UIColor', {
    clearColor: 'clear',
    colorWithWhiteAlpha: (white: number, alpha: number) => ({ white, alpha }),
  });
  vi.stubGlobal('UIAccessibilityIsReduceTransparencyEnabled', () => preferences.reduceTransparency);
  vi.stubGlobal('UIAccessibilityDarkerSystemColorsEnabled', () => preferences.increaseContrast);
  vi.stubGlobal('UIAccessibilityReduceTransparencyStatusDidChangeNotification', 'transparency');
  vi.stubGlobal('UIAccessibilityDarkerSystemColorsStatusDidChangeNotification', 'contrast');
  return { effect, host, preferences, createMaterial, blur: attachPopoverBlur(host, 'light') };
}

it('blurs only the background, never intercepts input or contributes accessibility elements', () => {
  const { effect, host, blur } = setup();
  expect(effect.effect).toEqual({ style: 12 });
  expect(effect.backgroundColor).toBe('clear');
  expect(effect.userInteractionEnabled).toBe(false);
  expect(effect.isAccessibilityElement).toBe(false);
  expect(effect.accessibilityElementsHidden).toBe(true);
  expect(host.insertSubviewAtIndex).toHaveBeenCalledWith(effect, 0);
  expect(effect.frame).toEqual(host.bounds);
  host.bounds = { width: 844, height: 390 };
  blur.layout();
  expect(effect.frame).toEqual(host.bounds);
  expect(host.sendSubviewToBack).toHaveBeenLastCalledWith(effect);
  blur.setScheme('dark');
  expect(effect.effect).toEqual({ style: 17 });
  blur.dispose();
});

it.each([
  [true, false],
  [false, true],
  [true, true],
])('uses a stronger scrim for accessibility preferences (%s, %s)', (transparency, contrast) => {
  const { effect, createMaterial, blur } = setup(transparency, contrast);
  expect(createMaterial).not.toHaveBeenCalled();
  expect(effect.effect).toBeNull();
  expect(effect.backgroundColor).toEqual({ white: 0, alpha: 0.45 });
  blur.dispose();
});

it('updates live preferences and releases native observers and the view on dismissal', () => {
  const { effect, preferences, createMaterial, blur } = setup();
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
  expect(effect.backgroundColor).toBe('clear');
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
