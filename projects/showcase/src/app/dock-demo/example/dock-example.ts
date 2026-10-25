import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  signal,
  linkedSignal,
} from '@angular/core';
import { DsyDock, DsyDockItem, DsyDockLabel } from '@ngx-daisy/cdk/dock';

interface DockValues {
  readonly size?: ReturnType<DsyDock['size']>;
  readonly label?: ReturnType<DsyDock['label']>;
}

interface DockItemValues {
  readonly disabled?: ReturnType<DsyDockItem['disabled']>;
  readonly active?: ReturnType<DsyDockItem['active']>;
}

@Component({
  selector: 'demo-dock-example',
  standalone: true,
  imports: [DsyDock, DsyDockItem, DsyDockLabel],
  templateUrl: './dock-example.html',
  styleUrl: './dock-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DockExample {
  readonly values = input<readonly [DockValues?, DockItemValues?, Record<string, never>?]>([]);
  readonly props = computed<DockValues>(() => this.values()[0] ?? {});
  readonly item = computed<DockItemValues>(() => this.values()[1] ?? {});
  readonly configuredActive = computed(() => this.item().active ?? false);
  readonly firstActive = linkedSignal(() => this.configuredActive());
  readonly selected = signal('');

  select(section: string): void {
    this.selected.set(section);
    this.firstActive.set(section === 'Home');
  }
}
