import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { DsyJoin, DsyJoinItem } from 'ngx-daisy/join';
import { DsyButton } from 'ngx-daisy/button';

interface JoinValues {
  readonly orientation?: ReturnType<DsyJoin['orientation']>;
}

@Component({
  selector: 'demo-join-example',
  standalone: true,
  imports: [DsyJoin, DsyJoinItem, DsyButton],
  templateUrl: './join-example.html',
  styleUrl: './join-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class JoinExample {
  readonly values = input<readonly [JoinValues?, Record<string, never>?]>([]);
  readonly props = computed<JoinValues>(() => this.values()[0] ?? {});
  readonly selected = signal('Day');
}
