import type { IconNode } from 'lucide';

/** Lucide vector geometry, materialized with the native control's current foreground. */
export function renderControlIcon(
  nodes: IconNode,
  color: string,
  size: number,
  opacity = 1,
): string {
  const escape = (value: string | number) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  const paths = nodes
    .map(
      ([tag, attributes]) =>
        `<${tag} ${Object.entries(attributes)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}="${escape(value!)}"`)
          .join(' ')}/>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${escape(color)}" opacity="${opacity}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}
