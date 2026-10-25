import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-diff',
  template: `<div class="dsy-diff-stage" [class]="daisy('diff') + ' ' + stageClass()">
    <div
      [class]="daisy('diff-item-1')"
      class="dsy-diff-before"
      [style.clip-path]="'inset(0 ' + (100 - safePosition()) + '% 0 0)'"
    >
      <ng-content select="[dsyDiffBefore]" />
    </div>
    <div [class]="daisy('diff-item-2')" class="dsy-diff-after">
      <ng-content select="[dsyDiffAfter]" />
    </div>
    <div
      [class]="daisy('diff-resizer')"
      class="dsy-diff-divider"
      [style.left.%]="safePosition()"
      aria-hidden="true"
    >
      <span class="dsy-diff-handle">‹ ›</span>
    </div>
    <input
      class="dsy-diff-slider"
      [class]="sliderClass()"
      type="range"
      min="0"
      max="100"
      [value]="safePosition()"
      [disabled]="disabled()"
      [attr.aria-label]="label()"
      [attr.aria-valuetext]="safePosition() + '% before'"
      (input)="position.set(+$any($event.target).value)"
    />
  </div>`,
  styleUrl: './diff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyDiff {
  readonly stageClass = input('');
  readonly sliderClass = input('');
  readonly daisy = injectDaisyUIClasses();
  readonly position = model(50);
  readonly label = input('Comparison position');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly safePosition = computed(() =>
    Math.max(0, Math.min(100, Number.isFinite(this.position()) ? this.position() : 50)),
  );
}
