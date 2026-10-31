import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { CircleCheck, Info, TriangleAlert, CircleX } from 'lucide';
import { DsyControlIcon } from '@ngx-daisy/native/control-icon';
/** A persistent, nonmodal message. Apps own dismissal and retry actions. */
@Component({
  selector: 'StackLayout[dsyAlert]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [DsyControlIcon],
  template: `
    <GridLayout columns="auto, *">
      <Image
        [dsyControlIcon]="icon()"
        [iconSize]="22"
        marginRight="12"
        verticalAlignment="top"
        [class]="iconClass()"
      />
      <StackLayout col="1" [class]="contentClass()">
        @if (title()) {
          <Label
            [text]="title()"
            class="dsy-native-alert-title"
            textWrap="true"
            accessibilityRole="header"
          ></Label>
        }
        @if (message()) {
          <Label
            [text]="message()"
            textWrap="true"
            [accessibilityLiveRegion]="announcement() === 'off' ? 'none' : announcement()"
          ></Label>
        }
        <ng-content />
      </StackLayout>
    </GridLayout>
  `,
  styleUrl: './alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyAlert {
  readonly color = input<'inherit' | 'info' | 'success' | 'warning' | 'error'>('inherit', {
    alias: 'dsyColor',
  });
  readonly variant = input<'solid' | 'outline' | 'soft'>('solid');
  readonly title = input('');
  readonly message = input('');
  /** Native Android live region; apps own iOS announcement timing. */
  readonly announcement = input<'off' | 'polite' | 'assertive'>('polite');
  readonly iconClass = input('');
  readonly contentClass = input('');
  readonly icon = computed(
    () =>
      ({ inherit: Info, info: Info, success: CircleCheck, warning: TriangleAlert, error: CircleX })[
        this.color()
      ],
  );
  readonly classes = computed(
    () => `dsy-native-alert dsy-native-alert-${this.color()} dsy-native-alert-${this.variant()}`,
  );
}
