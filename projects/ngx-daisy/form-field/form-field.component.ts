import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyLabel } from '@ngx-daisy/cdk/label';
import { DsyIdGenerator } from '@ngx-daisy/cdk/overlay';
import { DSY_FIELD_CONTROL } from './field-control';
@Directive({ selector: '[dsyPrefix]', standalone: true, host: { class: 'dsy-field-prefix' } })
export class DsyPrefix {}
@Directive({ selector: '[dsySuffix]', standalone: true, host: { class: 'dsy-field-suffix' } })
export class DsySuffix {}
@Component({
  selector: 'dsy-hint',
  standalone: true,
  template: '<ng-content/>',
  host: { '[id]': 'id()', class: 'dsy-hint' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyHint {
  readonly id = input(inject(DsyIdGenerator).next('dsy-hint'));
}
@Component({
  selector: 'dsy-error,dsy-validator-hint',
  standalone: true,
  template: '<ng-content/>',
  host: { '[id]': 'id()', class: 'dsy-error', '[class]': 'classes' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyError {
  readonly id = input(inject(DsyIdGenerator).next('dsy-error'));
  protected readonly classes = injectDaisyUIClasses()('validator-hint');
}
@Component({
  selector: 'dsy-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dsy-form-field',
    '[class.dsy-field-error]': 'control()?.errorState()',
    '[class.dsy-field-disabled]': 'control()?.isDisabled()',
  },
})
export class DsyFormField {
  protected readonly labelId = inject(DsyIdGenerator).next('dsy-field-label');
  readonly label = input('');
  readonly hideRequiredMarker = input(false, { transform: booleanAttribute });
  private readonly controls = contentChildren(DSY_FIELD_CONTROL, { descendants: true });
  protected readonly control = contentChild(DSY_FIELD_CONTROL, { descendants: true });
  protected readonly projectedLabel = contentChild(DsyLabel);
  protected readonly hints = contentChildren(DsyHint, { descendants: true });
  protected readonly errors = contentChildren(DsyError, { descendants: true });
  protected readonly showErrors = computed(
    () => !!this.control()?.errorState() && this.errors().length > 0,
  );
  constructor() {
    afterRenderEffect((onCleanup) => {
      if (this.controls().length !== 1)
        throw new Error('dsy-form-field requires exactly one field control.');
      const control = this.control();
      const ids = (this.showErrors() ? this.errors() : this.hints()).map((item) => item.id());
      control?.setDescribedByIds(ids);
      control?.setLabelledById?.(this.label() || this.projectedLabel() ? this.labelId : null);
      onCleanup(() => {
        control?.setDescribedByIds([]);
        control?.setLabelledById?.(null);
      });
    });
  }
}
