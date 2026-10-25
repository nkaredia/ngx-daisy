import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyFieldset, DsyLegend, DsyFieldsetLabel } from 'ngx-daisy/fieldset';
import { DsyInput } from 'ngx-daisy/input';

interface ExampleValues {}
interface SecondaryValues {
  readonly color?: ReturnType<DsyInput['color']>;
  readonly size?: ReturnType<DsyInput['size']>;
  readonly variant?: ReturnType<DsyInput['variant']>;
}

@Component({
  selector: 'demo-fieldset-example',
  standalone: true,
  imports: [DsyFieldset, DsyLegend, DsyFieldsetLabel, DsyInput],
  templateUrl: './fieldset-example.html',
  styleUrl: './fieldset-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FieldsetExample {
  readonly values = input<readonly [ExampleValues?, SecondaryValues?]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly secondary = computed(() => this.values()[1] ?? {});
  readonly value = signal('');
}
