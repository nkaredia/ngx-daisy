import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyTextarea } from '@ngx-daisy/cdk/textarea';

interface ExampleValues {
  readonly color?: ReturnType<DsyTextarea['color']>;
  readonly size?: ReturnType<DsyTextarea['size']>;
  readonly variant?: ReturnType<DsyTextarea['variant']>;
  readonly rows?: ReturnType<DsyTextarea['rows']>;
  readonly autosize?: ReturnType<DsyTextarea['autosize']>;
}

@Component({
  selector: 'demo-textarea-example',
  standalone: true,
  imports: [DsyTextarea],
  templateUrl: './textarea-example.html',
  styleUrl: './textarea-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TextareaExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly value = signal('');
  onInput(event: Event): void {
    if (event.target instanceof HTMLTextAreaElement) this.value.set(event.target.value);
  }
}
