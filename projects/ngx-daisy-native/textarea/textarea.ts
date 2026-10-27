import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
} from '@angular/core';
import { DsyTextControl } from '@ngx-daisy/native/input';
/** A native multiline editor, sharing Input's Signal Forms contract. */
@Component({
  selector: 'TextView[dsyTextarea]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  host: {
    class: 'dsy-native-textarea',
    '[text]': 'value()',
    '[isEnabled]': '!disabled() && !hidden()',
    '[editable]': '!readonly()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    '[accessibilityHidden]': 'hidden()',
    '[accessibilityLabel]': 'label()',
    '[accessibilityHint]': 'description()',
    '[class]': 'classes()',
    '(textChange)': 'onTextChange($event)',
    '(blur)': 'touch.emit()',
  },
  template: '',
  styleUrl: './textarea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyTextarea extends DsyTextControl {}
