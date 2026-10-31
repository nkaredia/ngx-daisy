import { Color, FormattedString, Span } from '@nativescript/core';
import { nativeTokenColor } from './state';
import type { PlaygroundSourceFile } from './types';
/** Build before assigning to a native TextView: per-span UI updates are quadratic. */
export function nativeSourceText(
  file: PlaygroundSourceFile | undefined,
  dark: boolean,
): FormattedString {
  const formatted = new FormattedString();
  if (!file) return formatted;
  const spans = (file.tokens ?? [{ content: file.content }]).map((token) => {
    const span = new Span();
    span.text = token.content;
    const color = nativeTokenColor('color' in token ? token.color : undefined, dark);
    if (color) span.color = new Color(color);
    return span;
  });
  formatted.spans.push(...spans);
  return formatted;
}
