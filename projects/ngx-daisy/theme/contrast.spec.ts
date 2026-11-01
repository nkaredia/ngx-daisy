import { evaluateDaisyContrast } from './contrast';

describe('WCAG contrast assessment', () => {
  it('assesses maximum contrast symmetrically', () => {
    const result = evaluateDaisyContrast([0, 0, 0], [255, 255, 255]);
    expect(result.ratio).toBe(21);
    expect(result.aaa.normalText).toBe(true);
    expect(evaluateDaisyContrast([255, 255, 255], [0, 0, 0])).toEqual(result);
  });
  it('distinguishes AA normal text from AAA normal text without rounding', () => {
    const result = evaluateDaisyContrast([118, 118, 118], [255, 255, 255]);
    expect(result.aa.normalText).toBe(true);
    expect(result.aaa.normalText).toBe(false);
    expect(result.aaa.largeText).toBe(true);
    expect(evaluateDaisyContrast([119, 119, 119], [255, 255, 255]).aa.normalText).toBe(false);
  });
  it('rejects invalid channels and fails identical colors', () => {
    expect(evaluateDaisyContrast([40, 40, 40], [40, 40, 40]).nonText).toBe(false);
    for (const channel of [-1, 256, NaN, Infinity]) {
      expect(() => evaluateDaisyContrast([channel, 0, 0], [0, 0, 0])).toThrow(RangeError);
    }
  });
});
