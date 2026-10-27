import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsyIcon } from '@ngx-daisy/native/icon';
import type { SvgArtwork } from '../icons/svg-artwork';
/** Native Button owns activation/accessibility; noninteractive artwork sits above it. */
@Component({
  selector: 'GridLayout[appIconButton]',
  standalone: true,
  imports: [DsyButton, DsyIcon],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<Button
      dsyButton
      text=""
      variant="ghost"
      shape="square"
      size="sm"
      [accessibilityLabel]="label()"
      (pressed)="pressed.emit()"
      horizontalAlignment="stretch"
      verticalAlignment="stretch"
    ></Button>
    <GridLayout
      [isUserInteractionEnabled]="false"
      accessible="false"
      horizontalAlignment="center"
      verticalAlignment="middle"
    >
      @if (artwork()) {
        <GridLayout dsyIcon [size]="20"
          ><AppSvgIcon [artwork]="artwork()" accessible="false"></AppSvgIcon
        ></GridLayout>
      } @else {
        <ng-content />
      }
    </GridLayout>`,
  host: { '[width]': '44', '[height]': '44' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeIconButton {
  readonly label = input.required<string>();
  readonly artwork = input<SvgArtwork>();
  readonly pressed = output<void>();
}
