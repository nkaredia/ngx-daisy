import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyBreadcrumbs } from '@ngx-daisy/cdk/breadcrumbs';

interface BreadcrumbsValues {
  readonly label?: ReturnType<DsyBreadcrumbs['label']>;
}

@Component({
  selector: 'demo-breadcrumbs-example',
  standalone: true,
  imports: [DsyBreadcrumbs],
  templateUrl: './breadcrumbs-example.html',
  styleUrl: './breadcrumbs-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbsExample {
  readonly values = input<readonly [BreadcrumbsValues?]>([]);
  readonly props = computed<BreadcrumbsValues>(() => this.values()[0] ?? {});
}
