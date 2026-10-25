import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  linkedSignal,
} from '@angular/core';
import { DsyTabs, DsyTab, DsyTabPanel } from 'ngx-daisy/tabs';

interface TabsValues {
  readonly selectedIndex?: ReturnType<DsyTabs['selectedIndex']>;
  readonly label?: ReturnType<DsyTabs['label']>;
  readonly listClass?: ReturnType<DsyTabs['listClass']>;
  readonly variant?: ReturnType<DsyTabs['variant']>;
  readonly size?: ReturnType<DsyTabs['size']>;
  readonly placement?: ReturnType<DsyTabs['placement']>;
  readonly orientation?: ReturnType<DsyTabs['orientation']>;
  readonly activation?: ReturnType<DsyTabs['activation']>;
}

interface TabValues {
  readonly disabled?: ReturnType<DsyTab['disabled']>;
  readonly label?: ReturnType<DsyTab['label']>;
}

interface TabPanelValues {
  readonly index?: ReturnType<DsyTabPanel['index']>;
}

@Component({
  selector: 'demo-tabs-example',
  standalone: true,
  imports: [DsyTabs, DsyTab, DsyTabPanel],
  templateUrl: './tabs-example.html',
  styleUrl: './tabs-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TabsExample {
  readonly values = input<readonly [TabsValues?, TabValues?, TabPanelValues?]>([]);
  readonly props = computed<TabsValues>(() => this.values()[0] ?? {});
  readonly tab = computed<TabValues>(() => this.values()[1] ?? {});
  readonly panel = computed<TabPanelValues>(() => this.values()[2] ?? {});
  readonly configuredSelectedIndex = computed(() => this.props().selectedIndex ?? 0);
  readonly selectedIndex = linkedSignal(() => this.configuredSelectedIndex());
}
