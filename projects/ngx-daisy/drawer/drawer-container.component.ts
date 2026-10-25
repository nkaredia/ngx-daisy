import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DSY_DRAWER_CONTAINER } from './drawer-context';
import { DsyDrawer } from './drawer.component';

@Component({
  selector: 'dsy-drawer-container',
  standalone: true,
  templateUrl: './drawer-container.component.html',
  styleUrl: './drawer-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_DRAWER_CONTAINER, useExisting: forwardRef(() => DsyDrawerContainer) }],
  host: {
    class: 'dsy-drawer-container',
    '[class]': 'classes()',
    '[attr.data-opened]': 'drawer()?.opened() ?? false',
    '[attr.data-mode]': 'drawer()?.mode() ?? "over"',
    '[attr.data-position]': 'drawer()?.position() ?? "start"',
  },
})
export class DsyDrawerContainer {
  protected readonly daisyClasses = injectDaisyUIClasses();
  private readonly drawers = contentChildren(DsyDrawer);
  protected readonly drawer = computed(() => {
    const drawers = this.drawers();
    if (drawers.length > 1) throw new Error('dsy-drawer-container supports one direct dsy-drawer.');
    return drawers[0];
  });
  protected readonly classes = computed(() => {
    const drawer = this.drawer();
    return this.daisyClasses(
      ...[
        'drawer',
        drawer?.opened() && drawer.mode() === 'side' ? 'drawer-open' : '',
        drawer?.position() === 'end' ? 'drawer-end' : '',
      ].filter(Boolean),
    );
  });
}
