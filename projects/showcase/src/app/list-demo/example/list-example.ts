import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { DsyList, DsyListRow, DsyListGrow, DsyListWrap } from '@ngx-daisy/cdk/list';
@Component({
  selector: 'demo-list-example',
  standalone: true,
  imports: [DsyList, DsyListRow, DsyListGrow, DsyListWrap],
  templateUrl: './list-example.html',
  styleUrl: './list-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ListExample {
  readonly values = input<readonly Record<string, never>[]>([]);
}
