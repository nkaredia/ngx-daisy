import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  linkedSignal,
} from '@angular/core';
import { DsyDrawer, DsyDrawerContainer, DsyDrawerContent } from 'ngx-daisy/drawer';
import { DsyButton } from 'ngx-daisy/button';

interface DrawerValues {
  readonly opened?: ReturnType<DsyDrawer['opened']>;
  readonly mode?: ReturnType<DsyDrawer['mode']>;
  readonly position?: ReturnType<DsyDrawer['position']>;
  readonly width?: ReturnType<DsyDrawer['width']>;
  readonly disableClose?: ReturnType<DsyDrawer['disableClose']>;
  readonly label?: ReturnType<DsyDrawer['label']>;
  readonly panelClass?: ReturnType<DsyDrawer['panelClass']>;
  readonly backdropClass?: ReturnType<DsyDrawer['backdropClass']>;
}

@Component({
  selector: 'demo-drawer-example',
  standalone: true,
  imports: [DsyDrawer, DsyDrawerContainer, DsyDrawerContent, DsyButton],
  templateUrl: './drawer-example.html',
  styleUrl: './drawer-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DrawerExample {
  readonly values = input<readonly [DrawerValues?, Record<string, never>?, Record<string, never>?]>(
    [],
  );
  readonly props = computed<DrawerValues>(() => this.values()[0] ?? {});
  readonly configuredOpened = computed(() => this.props().opened ?? false);
  readonly opened = linkedSignal(() => this.configuredOpened());
}
