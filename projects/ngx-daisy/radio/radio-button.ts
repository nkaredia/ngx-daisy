import { FocusOrigin } from '@angular/cdk/a11y';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DSY_RADIO_GROUP } from './radio-context';
@Component({
  selector: 'dsy-radio-button',
  standalone: true,
  template: `<label class="dsy-radio-label" [attr.data-label-position]="group.labelPosition()"
    ><input
      type="radio"
      [class]="group.radioClasses() + ' ' + inputClass()"
      [name]="group.groupName()"
      [checked]="selected()"
      [disabled]="disabled"
      [required]="group.isRequired()"
      [tabIndex]="group.tabIndex(this)"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="group.describedBy()"
      (click)="guardClick($event)"
      (change)="group.select(this)"
      (focus)="group.activate(this)" /><span><ng-content /></span
  ></label>`,
  styles: `
    @layer components {
      .dsy-radio-label {
        display: inline-flex;
        gap: 0.6rem;
        align-items: center;
        cursor: pointer;
      }
      .dsy-radio-label[data-label-position='before'] {
        flex-direction: row-reverse;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyRadioButton {
  readonly inputClass = input('');
  readonly value = input.required<unknown>();
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly group = inject(DSY_RADIO_GROUP);
  readonly selected = computed(() => this.group.compareWith()(this.group.value(), this.value()));
  protected guardClick(event: Event): void {
    if (this.group.readonly()) event.preventDefault();
  }
  get disabled(): boolean {
    return this.disabledInput() || this.group.isDisabled();
  }
  focus(options?: FocusOptions | FocusOrigin): void {
    this.element
      .querySelector('input')
      ?.focus(typeof options === 'object' && options ? options : { preventScroll: true });
  }
  getLabel(): string {
    return this.ariaLabel() || this.element.textContent?.trim() || '';
  }
}
