import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyToastOutlet, DsyToastService } from '@ngx-daisy/cdk/toast';
import { DsyButton } from '@ngx-daisy/cdk/button';

interface ExampleValues {
  readonly horizontal?: ReturnType<DsyToastOutlet['horizontal']>;
  readonly vertical?: ReturnType<DsyToastOutlet['vertical']>;
  readonly toastClass?: ReturnType<DsyToastOutlet['toastClass']>;
  readonly dismissLabel?: ReturnType<DsyToastOutlet['dismissLabel']>;
  readonly dismissButtonClass?: ReturnType<DsyToastOutlet['dismissButtonClass']>;
}

@Component({
  selector: 'demo-toast-example',
  standalone: true,
  imports: [DsyToastOutlet, DsyButton],
  providers: [DsyToastService],
  templateUrl: './toast-example.html',
  styleUrl: './toast-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ToastExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  private readonly service = inject(DsyToastService);
  show(): void {
    this.service.clear();
    this.service.show('Workspace saved', { color: 'success', duration: 5000 });
  }
}
