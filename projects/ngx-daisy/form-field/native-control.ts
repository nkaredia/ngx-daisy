import { FocusMonitor } from '@angular/cdk/a11y';
import {
  afterEveryRender,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  Renderer2,
  signal,
} from '@angular/core';
import { DsyIdGenerator } from '@ngx-daisy/cdk/overlay';
import { DSY_FIELD_CONTROL, DsyFieldControl } from './field-control';
import { DsyErrorStateMatcher, injectDsyFormState } from './form-state';
@Directive({
  selector: '[dsyNativeControl]',
  standalone: true,
  providers: [{ provide: DSY_FIELD_CONTROL, useExisting: forwardRef(() => DsyNativeControl) }],
  host: {
    '[attr.aria-required]': 'isRequired() ? "true" : null',
    '[attr.aria-invalid]': 'errorState() ? "true" : null',
    '[attr.aria-busy]': 'formState().pending ? "true" : null',
    '[class.dsy-control-invalid]': 'errorState()',
  },
})
export class DsyNativeControl implements DsyFieldControl {
  readonly element =
    inject<ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>(ElementRef)
      .nativeElement;
  readonly errorStateMatcher = input(inject(DsyErrorStateMatcher));
  readonly focused = signal(false);
  private readonly metadata = signal({
    id: this.element.id,
    required: this.element.required,
    disabled: this.element.disabled,
  });
  readonly formState = injectDsyFormState(() => this.metadata());
  readonly errorState = computed(() => this.errorStateMatcher().isErrorState(this.formState()));
  readonly isDisabled = computed(() => this.metadata().disabled || this.formState().disabled);
  readonly isRequired = computed(() => this.metadata().required || this.formState().required);
  readonly controlId = computed(() => this.metadata().id);
  private ids: string[] = [];
  constructor() {
    const generated = inject(DsyIdGenerator).next('dsy-native');
    const monitor = inject(FocusMonitor);
    const renderer = inject(Renderer2);
    const subscription = monitor
      .monitor(this.element)
      .subscribe((origin) => this.focused.set(!!origin));
    afterEveryRender(() => {
      this.syncDescriptions();
      if (!this.element.id) this.element.id = generated;
      const next = {
        id: this.element.id,
        required: this.element.required,
        disabled: this.element.disabled,
      };
      const current = this.metadata();
      if (
        next.id !== current.id ||
        next.required !== current.required ||
        next.disabled !== current.disabled
      )
        this.metadata.set(next);
    });
    const remove = renderer.listen(
      this.element,
      'click',
      (event: Event) => {
        if (this.readOnlyChoice()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
    const removeKey = renderer.listen(
      this.element,
      'keydown',
      (event: KeyboardEvent) => {
        if (
          this.readOnlyChoice() &&
          [
            ' ',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Home',
            'End',
            'PageUp',
            'PageDown',
          ].includes(event.key)
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
    inject(DestroyRef).onDestroy(() => {
      subscription.unsubscribe();
      monitor.stopMonitoring(this.element);
      remove();
      removeKey();
    });
  }
  private readOnlyChoice(): boolean {
    return (
      this.element instanceof HTMLInputElement &&
      this.element.readOnly &&
      ['checkbox', 'radio', 'range'].includes(this.element.type)
    );
  }
  focus(options?: FocusOptions): void {
    this.element.focus(options);
  }
  setDescribedByIds(ids: string[]): void {
    this.syncDescriptions(ids);
  }
  private syncDescriptions(ids = this.ids): void {
    const existing = (this.element.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && !this.ids.includes(id));
    this.ids = ids;
    const value = [...new Set([...existing, ...ids])].join(' ');
    if (this.element.getAttribute('aria-describedby') === (value || null)) return;
    if (value) this.element.setAttribute('aria-describedby', value);
    else this.element.removeAttribute('aria-describedby');
  }
}
