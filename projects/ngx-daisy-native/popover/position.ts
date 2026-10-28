export interface PopoverRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface PopoverPosition {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  side: 'top' | 'bottom';
}
/** All coordinates use density-independent units in the overlay's own coordinate space. */
export function positionPopover(
  anchor: PopoverRect,
  viewport: { width: number; height: number },
  options: {
    width?: number | 'anchor';
    maxHeight?: number;
    contentHeight?: number;
    gap?: number;
    placement?: 'auto' | 'bottom' | 'top';
    align?: 'start' | 'end';
  },
): PopoverPosition {
  const margin = 12;
  const finite = (value: number | undefined, fallback: number) =>
    Number.isFinite(value) ? Math.max(0, value!) : fallback;
  const gap = finite(options.gap, 6);
  const width = Math.max(
    1,
    Math.min(
      options.width === undefined || options.width === 'anchor'
        ? anchor.width
        : finite(options.width, anchor.width),
      viewport.width - margin * 2,
    ),
  );
  const bottom = Math.max(0, viewport.height - margin - (anchor.y + anchor.height + gap));
  const top = Math.max(0, anchor.y - gap - margin);
  const desired = Math.min(finite(options.maxHeight, 360), finite(options.contentHeight, 360));
  const preferTop = options.placement === 'top';
  const preferredSpace = preferTop ? top : bottom;
  const otherSpace = preferTop ? bottom : top;
  const side =
    preferredSpace < desired && otherSpace > preferredSpace
      ? preferTop
        ? 'bottom'
        : 'top'
      : preferTop
        ? 'top'
        : 'bottom';
  const maxHeight = Math.max(
    1,
    Math.min(finite(options.maxHeight, 360), side === 'top' ? top : bottom),
  );
  const height = Math.min(desired, maxHeight);
  return {
    width,
    maxHeight,
    side,
    left: Math.max(
      margin,
      Math.min(
        options.align === 'end' ? anchor.x + anchor.width - width : anchor.x,
        viewport.width - width - margin,
      ),
    ),
    top: Math.max(
      margin,
      Math.min(
        side === 'top' ? anchor.y - gap - height : anchor.y + anchor.height + gap,
        viewport.height - margin - height,
      ),
    ),
  };
}
