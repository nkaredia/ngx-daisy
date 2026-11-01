interface Snapshot {
  frame: unknown;
  transform: unknown;
  userInteractionEnabled: boolean;
  accessibilityElementsHidden: boolean;
  removeFromSuperview(): void;
}
interface Surface {
  alpha: number;
  frame: unknown;
  superview?: { addSubview(view: Snapshot): void };
  layoutIfNeeded(): void;
  setNeedsDisplay?(): void;
  window?: { setNeedsDisplay(): void };
  snapshotViewAfterScreenUpdates(afterUpdates: boolean): Snapshot | null;
}
declare const UIView: {
  performWithoutAnimation(work: () => void): void;
  animateWithDurationAnimationsCompletion(
    seconds: number,
    work: () => void,
    done: () => void,
  ): void;
};
declare const CGAffineTransformIdentity: unknown;
declare function CGAffineTransformMakeTranslation(x: number, y: number): unknown;

export interface SidebarSnapshotBridge {
  withoutAnimation(work: () => void): void;
  animate(seconds: number, work: () => void, done: () => void): void;
  translation(x: number, y: number): unknown;
  identity: unknown;
  capture(surface: Surface): Snapshot | null;
  schedule(work: () => void): () => void;
}

/** Short-lived, noninteractive presentation; the real layout never receives a transform. */
export function animateSidebarSnapshot(
  view: { opacity: number; ios: unknown },
  opened: boolean,
  seconds: number,
  completed: () => void,
  bridge?: SidebarSnapshotBridge,
): () => void {
  const api = bridge ?? {
    withoutAnimation: (work: () => void) => UIView.performWithoutAnimation(work),
    animate: (duration: number, work: () => void, done: () => void) =>
      UIView.animateWithDurationAnimationsCompletion(duration, work, done),
    translation: CGAffineTransformMakeTranslation,
    identity: CGAffineTransformIdentity,
    capture: (surface: Surface) => surface.snapshotViewAfterScreenUpdates(true),
    schedule: (work: () => void) => {
      const timer = setTimeout(work);
      return () => clearTimeout(timer);
    },
  };
  const native = view.ios as Surface;
  let snapshot: Snapshot | undefined;
  let cancelled = false;
  let settled = false;
  const restore = () => {
    snapshot?.removeFromSuperview();
    snapshot = undefined;
    view.opacity = 1;
    native.alpha = 1;
    native.setNeedsDisplay?.();
    native.window?.setNeedsDisplay();
  };
  const finish = () => {
    if (!cancelled && !settled) {
      settled = true;
      restore();
      completed();
    }
  };
  const stopTimer = api.schedule(() => {
    if (cancelled) return;
    try {
      api.withoutAnimation(() => {
        native.alpha = 1;
        native.layoutIfNeeded();
        snapshot = api.capture(native) ?? undefined;
        if (!snapshot || !native.superview) return;
        snapshot.frame = native.frame;
        snapshot.userInteractionEnabled = false;
        snapshot.accessibilityElementsHidden = true;
        native.superview.addSubview(snapshot);
        snapshot.transform = opened ? api.translation(-288, 0) : api.identity;
        native.alpha = 0;
      });
      if (!snapshot || !native.superview) {
        finish();
        return;
      }
      const presentation = snapshot;
      api.animate(
        seconds,
        () => {
          presentation.transform = opened ? api.identity : api.translation(-288, 0);
        },
        finish,
      );
    } catch {
      finish();
    }
  });
  return () => {
    cancelled = true;
    stopTimer();
    restore();
  };
}
