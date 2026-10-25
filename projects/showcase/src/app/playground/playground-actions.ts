import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyInput } from '@ngx-daisy/cdk/input';
import { DsySelect } from '@ngx-daisy/cdk/select';
import { DsyToggle } from '@ngx-daisy/cdk/toggle';
import type {
  PlaygroundActionComponents,
  PlaygroundProperty,
  PlaygroundValue,
} from './playground.types';

@Directive()
abstract class PlaygroundAction {
  readonly property = input.required<PlaygroundProperty>();
  readonly value = input<PlaygroundValue>();
  readonly controlId = input.required<string>();
  readonly update = input.required<(value: PlaygroundValue) => void>();
}

@Component({
  selector: 'demo-playground-select-action',
  imports: [DsySelect],
  template: `<select
    dsySelect
    size="sm"
    [id]="controlId()"
    [attr.aria-label]="property().name"
    [attr.aria-describedby]="controlId() + '-description'"
    (change)="choose($event)"
  >
    <option value="-1" disabled [selected]="selected() < 0">Choose a value</option>
    @for (option of options(); track $index) {
      <option [value]="$index" [selected]="$index === selected()">{{ option }}</option>
    }
  </select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PlaygroundSelectAction extends PlaygroundAction {
  readonly options = computed(() => {
    const action = this.property().action;
    return action.kind === 'select' ? action.options : [];
  });
  readonly selected = computed(() =>
    this.options().findIndex((option) => Object.is(option, this.value())),
  );
  choose(event: Event): void {
    const index = Number((event.target as HTMLSelectElement).value);
    if (Number.isInteger(index) && index >= 0 && index < this.options().length)
      this.update()(this.options()[index]);
  }
}

@Component({
  selector: 'demo-playground-toggle-action',
  imports: [DsyToggle],
  template: `<div class="playground-toggle">
    <input
      dsyToggle
      size="sm"
      color="primary"
      type="checkbox"
      [id]="controlId()"
      [attr.aria-label]="property().name"
      [attr.aria-describedby]="controlId() + '-description'"
      [checked]="value() === true"
      [disabled]="!options().includes(value() !== true)"
      (change)="choose($event)"
    />
    <span aria-hidden="true">{{
      value() === undefined ? 'Unset' : value() === null ? 'Null' : value() ? 'True' : 'False'
    }}</span>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PlaygroundToggleAction extends PlaygroundAction {
  readonly options = computed(() => {
    const action = this.property().action;
    return action.kind === 'toggle' ? action.options : [];
  });
  choose(event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    if (this.options().includes(value)) this.update()(value);
  }
}

@Component({
  selector: 'demo-playground-text-action',
  imports: [DsyInput],
  template: `<input
    dsyInput
    size="sm"
    type="text"
    [id]="controlId()"
    [attr.aria-label]="property().name"
    [attr.aria-describedby]="controlId() + '-description'"
    [value]="value() ?? ''"
    (input)="update()($any($event.target).value)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PlaygroundTextAction extends PlaygroundAction {}

@Component({
  selector: 'demo-playground-number-action',
  imports: [DsyInput],
  template: `<input
    dsyInput
    size="sm"
    type="number"
    [id]="controlId()"
    [attr.aria-label]="property().name"
    [attr.aria-describedby]="controlId() + '-description'"
    [value]="value() ?? ''"
    (input)="choose($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PlaygroundNumberAction extends PlaygroundAction {
  choose(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '' && this.property().optional) this.update()(undefined);
    else if (Number.isFinite(input.valueAsNumber)) this.update()(input.valueAsNumber);
  }
}

@Component({
  selector: 'demo-playground-unsupported-action',
  template: `<p class="playground-unsupported">{{ reason() }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PlaygroundUnsupportedAction extends PlaygroundAction {
  readonly reason = computed(() => {
    const action = this.property().action;
    return action.kind === 'unsupported' ? action.reason : '';
  });
}

export const playgroundActions = {
  select: PlaygroundSelectAction,
  toggle: PlaygroundToggleAction,
  text: PlaygroundTextAction,
  number: PlaygroundNumberAction,
  unsupported: PlaygroundUnsupportedAction,
} satisfies PlaygroundActionComponents;
