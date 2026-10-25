import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions } from 'ngx-daisy/card';
import { DsyButton } from 'ngx-daisy/button';
export interface CardExampleValues {
  readonly size?: ReturnType<DsyCard['size']>;
  readonly border?: ReturnType<DsyCard['border']>;
  readonly side?: ReturnType<DsyCard['side']>;
  readonly imageFull?: ReturnType<DsyCard['imageFull']>;
}
@Component({
  selector: 'demo-card-example',
  standalone: true,
  imports: [DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions, DsyButton],
  templateUrl: './card-example.html',
  styleUrl: './card-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardExample {
  readonly values = input<readonly CardExampleValues[]>([]);
  readonly props = computed<CardExampleValues>(() => this.values()[0] ?? {});
  readonly saved = signal(false);
  readonly toggle = (value: boolean) => !value;
}
