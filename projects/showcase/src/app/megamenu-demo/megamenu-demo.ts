import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyMegamenu, DsyMegamenuItem } from '@ngx-daisy/cdk/megamenu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
@Component({
  selector: 'demo-megamenu-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyMegamenu, DsyMegamenuItem],
  templateUrl: './megamenu-demo.html',
  styleUrl: './megamenu-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MegamenuDemo {
  readonly playground = playground;
  readonly vertical = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 640px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );
}
