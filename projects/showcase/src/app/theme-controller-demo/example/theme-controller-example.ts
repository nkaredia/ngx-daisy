import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyThemeController } from '@ngx-daisy/cdk/theme-controller';
import { DsyButton } from '@ngx-daisy/cdk/button';

interface ThemeControllerValues {
  readonly theme?: ReturnType<DsyThemeController['theme']>;
}

@Component({
  selector: 'demo-theme-controller-example',
  imports: [DsyThemeController, DsyButton],
  templateUrl: './theme-controller-example.html',
  styleUrl: './theme-controller-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ThemeControllerExample {
  readonly values = input<readonly ThemeControllerValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly enabled = signal(false);
}
