import type { NativePlaygroundConfig, PlaygroundProperty, PlaygroundValue } from './types';
export type NativePlaygroundOverrides = Record<number, Record<string, PlaygroundValue>>;
export function playgroundValue(
  config: NativePlaygroundConfig,
  overrides: NativePlaygroundOverrides,
  index: number,
  property: PlaygroundProperty,
): PlaygroundValue {
  const edited = overrides[index];
  if (edited && Object.hasOwn(edited, property.property)) return edited[property.property];
  const initial = config.initialValues?.[index];
  return initial && Object.hasOwn(initial, property.property)
    ? initial[property.property]
    : property.default;
}
export function literalIndex(property: PlaygroundProperty, value: PlaygroundValue): string {
  return property.action.kind === 'select'
    ? String(property.action.options.findIndex((option) => Object.is(option, value)))
    : '';
}
export function selectedLiteral(property: PlaygroundProperty, index: string): PlaygroundValue {
  const number = Number(index);
  return property.action.kind === 'select' && Number.isInteger(number) && number >= 0
    ? property.action.options[number]
    : undefined;
}
export function nativeTokenColor(color: string | undefined, dark: boolean): string | undefined {
  const match = color?.match(/^light-dark\(([^,]+),\s*([^)]+)\)$/);
  return match ? match[dark ? 2 : 1]?.trim() : color;
}
