import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Application, type View } from '@nativescript/core';
import { DSY_MOTION_CONFIG, nativeMotionEnabled } from '@ngx-daisy/native/motion';
/** Decorative loading shape; the owning region supplies a single busy announcement. */
@Component({
  selector: 'StackLayout[dsySkeleton]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    accessible: 'false',
    accessibilityHidden: 'true',
    isUserInteractionEnabled: 'false',
    '(loaded)': 'refresh(true)',
    '(unloaded)': 'refresh(false)',
  },
})
export class DsySkeleton {
  readonly animate = input(true, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly shape = input<'box' | 'circle' | 'text'>('box');
  private readonly config = inject(DSY_MOTION_CONFIG);
  private readonly loaded = signal(false);
  private readonly motionAllowed = signal(false);
  private readonly view = inject<ElementRef<View>>(ElementRef).nativeElement;
  readonly classes = computed(() =>
    [
      'dsy-native-skeleton',
      `dsy-native-skeleton-${this.shape()}`,
      this.animate() && !this.hidden() && this.loaded() && this.motionAllowed()
        ? 'dsy-native-skeleton-animated'
        : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  constructor() {
    const resume = () => this.refresh(this.view.isLoaded);
    Application.on?.('resume', resume);
    inject(DestroyRef).onDestroy(() => Application.off?.('resume', resume));
  }
  protected refresh(loaded: boolean): void {
    this.loaded.set(loaded);
    this.motionAllowed.set(loaded && nativeMotionEnabled(this.config));
  }
}
