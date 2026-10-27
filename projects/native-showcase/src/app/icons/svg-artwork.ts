import type { IconNode } from 'lucide';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/** App-owned vector data: no provider registry or DOM rendering. */
export interface SvgArtwork {
  readonly viewBox: string;
  readonly attributes: Readonly<Record<string, string | number>>;
  readonly nodes: ReadonlyArray<
    readonly [string, Readonly<Record<string, string | number | undefined>>]
  >;
}

export function lucideArtwork(nodes: IconNode): SvgArtwork {
  return {
    viewBox: '0 0 24 24',
    attributes: {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    nodes,
  };
}

export function fontAwesomeArtwork(definition: IconDefinition): SvgArtwork {
  const [width, height, , , paths] = definition.icon;
  return {
    viewBox: `0 0 ${width} ${height}`,
    attributes: { fill: 'currentColor' },
    nodes: (Array.isArray(paths) ? paths : [paths]).map((d) => ['path', { d }] as const),
  };
}

function escapeAttribute(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Materialize currentColor because native SVG engines do not inherit the native view's CSS. */
export function renderArtwork(artwork: SvgArtwork, color: string, opacity = 1): string {
  const attributes = (values: Readonly<Record<string, string | number | undefined>>) =>
    Object.entries(values)
      .filter(([, value]) => value !== undefined)
      .map(
        ([key, value]) => `${key}="${escapeAttribute(value === 'currentColor' ? color : value!)}"`,
      )
      .join(' ');
  const nodes = artwork.nodes.map(([tag, values]) => `<${tag} ${attributes(values)}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${escapeAttribute(artwork.viewBox)}" opacity="${Math.min(1, Math.max(0, opacity))}" ${attributes(artwork.attributes)}>${nodes}</svg>`;
}
