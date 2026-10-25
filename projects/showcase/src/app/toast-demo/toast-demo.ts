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
import { DsyToast, DsyToastOutlet, DsyToastService } from '@ngx-daisy/cdk/toast';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-toast-demo',
  imports: [Playground, DsyToast, DsyToastOutlet],
  templateUrl: './toast-demo.html',
  styleUrl: './toast-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ToastDemo {
  readonly playground = playground;
  readonly service = inject(DsyToastService);
  constructor() {
    inject(DestroyRef).onDestroy(() => this.service.clear());
  }
  notify() {
    this.service.show('Project saved', { color: 'success' });
  }
  timed() {
    this.service.show('Background sync complete', { color: 'info', duration: 5000 });
  }
}
