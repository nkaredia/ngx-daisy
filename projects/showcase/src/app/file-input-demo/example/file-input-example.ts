import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyFileInput } from '@ngx-daisy/cdk/file-input';

interface ExampleValues {
  readonly hidden?: ReturnType<DsyFileInput['hidden']>;
  readonly disabled?: ReturnType<DsyFileInput['disabled']>;
  readonly readonly?: ReturnType<DsyFileInput['readonly']>;
  readonly required?: ReturnType<DsyFileInput['required']>;
  readonly invalid?: ReturnType<DsyFileInput['invalid']>;
  readonly touched?: ReturnType<DsyFileInput['touched']>;
  readonly dirty?: ReturnType<DsyFileInput['dirty']>;
  readonly pending?: ReturnType<DsyFileInput['pending']>;
  readonly name?: ReturnType<DsyFileInput['name']>;
  readonly id?: ReturnType<DsyFileInput['id']>;
  readonly ariaLabel?: ReturnType<DsyFileInput['ariaLabel']>;
  readonly ariaLabelledBy?: ReturnType<DsyFileInput['ariaLabelledBy']>;
  readonly ariaDescribedBy?: ReturnType<DsyFileInput['ariaDescribedBy']>;
  readonly color?: ReturnType<DsyFileInput['color']>;
  readonly size?: ReturnType<DsyFileInput['size']>;
  readonly inputClass?: ReturnType<DsyFileInput['inputClass']>;
  readonly accept?: ReturnType<DsyFileInput['accept']>;
  readonly multiple?: ReturnType<DsyFileInput['multiple']>;
  readonly capture?: ReturnType<DsyFileInput['capture']>;
  readonly variant?: ReturnType<DsyFileInput['variant']>;
  readonly value?: ReturnType<DsyFileInput['value']>;
}

@Component({
  selector: 'demo-file-input-example',
  standalone: true,
  imports: [DsyFileInput],
  templateUrl: './file-input-example.html',
  styleUrl: './file-input-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FileInputExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly selected = signal<readonly File[] | null>(null);
}
