/** Opaque, composited sRGB channels in the inclusive range 0–255. */
export type DsySrgbColor = readonly [red: number, green: number, blue: number];

function luminance(color: DsySrgbColor): number {
  if (
    color.length !== 3 ||
    color.some((value) => !Number.isFinite(value) || value < 0 || value > 255)
  ) {
    throw new RangeError('Provide three finite sRGB channels between 0 and 255.');
  }
  const linear = color.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

/** WCAG contrast for resolved opaque colors. Composite transparency before calling. */
export function evaluateDaisyContrast(foreground: DsySrgbColor, background: DsySrgbColor) {
  const first = luminance(foreground);
  const second = luminance(background);
  const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  return {
    ratio,
    aa: { normalText: ratio >= 4.5, largeText: ratio >= 3 },
    aaa: { normalText: ratio >= 7, largeText: ratio >= 4.5 },
    nonText: ratio >= 3,
  } as const;
}
