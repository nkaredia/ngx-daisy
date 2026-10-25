import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  afterEveryRender,
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  computed,
  Component,
  effect,
  inject,
  Injector,
  input,
  numberAttribute,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DsyNativeControl } from 'ngx-daisy/form-field';
const colors = {
  neutral: 'textarea-neutral',
  primary: 'textarea-primary',
  secondary: 'textarea-secondary',
  accent: 'textarea-accent',
  info: 'textarea-info',
  success: 'textarea-success',
  warning: 'textarea-warning',
  error: 'textarea-error',
};
const sizes = {
  xs: 'textarea-xs',
  sm: 'textarea-sm',
  md: 'textarea-md',
  lg: 'textarea-lg',
  xl: 'textarea-xl',
};
@Component({
  template: '<ng-content/>',
  styleUrl: './textarea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'textarea[dsyTextarea]',
  standalone: true,
  exportAs: 'dsyTextarea',
  hostDirectives: [
    { directive: DsyNativeControl, inputs: ['errorStateMatcher'] },
    {
      directive: CdkTextareaAutosize,
      inputs: ['cdkAutosizeMinRows:minRows', 'cdkAutosizeMaxRows:maxRows'],
    },
  ],
  host: {
    '[class]': 'classes()',
    '[attr.data-autosize]': 'autosize()',
    '[class.cdk-textarea-autosize]': 'autosize()',
    '[attr.rows]': 'autosize() ? 1 : rows()',
    '[style.--dsy-textarea-inset]': 'inset()',
  },
})
export class DsyTextarea {
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly variant = input<'bordered' | 'ghost'>('bordered');
  readonly control = inject(DsyNativeControl);
  private readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.daisy(
      'textarea',
      colors[this.color()!] ?? '',
      sizes[this.size()!] ?? '',
      this.variant() === 'ghost' ? 'textarea-ghost' : '',
      this.control.errorState() ? 'textarea-error' : '',
    ).trim(),
  );
  readonly rows = input(2, { transform: numberAttribute });
  readonly autosize = input(false, { transform: booleanAttribute });
  private readonly autosizer = inject(CdkTextareaAutosize);
  protected readonly inset = signal('0px');
  private readonly injector = inject(Injector);
  constructor() {
    effect(() => (this.autosizer.enabled = this.autosize()));
    afterEveryRender(() => {
      if (!this.autosize()) return;
      const style = getComputedStyle(this.control.element);
      const sum =
        ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce(
          (total, key) =>
            total + (parseFloat(style[key as keyof CSSStyleDeclaration] as string) || 0),
          0,
        ) + 'px';
      if (sum !== this.inset()) {
        this.inset.set(sum);
        afterNextRender(() => this.autosizer.resizeToFitContent(true), { injector: this.injector });
      }
    });
  }
  focus(options?: FocusOptions): void {
    this.control.focus(options);
  }
}
