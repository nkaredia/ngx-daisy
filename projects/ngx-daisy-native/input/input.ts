import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
} from '@angular/core';
import { DsyTextControl } from './text-control';
/** A native single-line text editor. Native keyboard/security properties remain available. */
@Component({
  selector: 'TextField[dsyInput]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  host: {
    '[text]': 'value()',
    '[isEnabled]': '!disabled() && !hidden()',
    '[editable]': '!readonly()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    '[accessibilityHidden]': 'hidden()',
    '[accessibilityLabel]': 'accessibleLabel()',
    '[accessibilityHint]': 'accessibleDescription()',
    '[class]': 'classes()',
    '(textChange)': 'onTextChange($event)',
    '(blur)': 'touch.emit()',
  },
  template: '',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyInput extends DsyTextControl {}
