import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  linkedSignal,
} from '@angular/core';
import { DsyMegamenu, DsyMegamenuItem } from '@ngx-daisy/cdk/megamenu';

interface MegamenuValues {
  readonly activeIndex?: ReturnType<DsyMegamenu['activeIndex']>;
  readonly label?: ReturnType<DsyMegamenu['label']>;
  readonly size?: ReturnType<DsyMegamenu['size']>;
  readonly width?: ReturnType<DsyMegamenu['width']>;
  readonly vertical?: ReturnType<DsyMegamenu['vertical']>;
  readonly panelClass?: ReturnType<DsyMegamenu['panelClass']>;
  readonly buttonClass?: ReturnType<DsyMegamenu['buttonClass']>;
}

interface MegamenuItemValues {
  readonly label?: ReturnType<DsyMegamenuItem['label']>;
  readonly disabled?: ReturnType<DsyMegamenuItem['disabled']>;
}

@Component({
  selector: 'demo-megamenu-example',
  standalone: true,
  imports: [DsyMegamenu, DsyMegamenuItem],
  templateUrl: './megamenu-example.html',
  styleUrl: './megamenu-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MegamenuExample {
  readonly values = input<readonly [MegamenuValues?, MegamenuItemValues?]>([]);
  readonly props = computed<MegamenuValues>(() => this.values()[0] ?? {});
  readonly item = computed<MegamenuItemValues>(() => this.values()[1] ?? {});
  readonly configuredActiveIndex = computed(() => this.props().activeIndex ?? null);
  readonly activeIndex = linkedSignal(() => this.configuredActiveIndex());
}
