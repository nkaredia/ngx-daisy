import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsySkeleton } from 'ngx-daisy/skeleton';

interface ExampleValues {
  readonly text?: ReturnType<DsySkeleton['text']>;
  readonly animate?: ReturnType<DsySkeleton['animate']>;
}

@Component({
  selector: 'demo-skeleton-example',
  standalone: true,
  imports: [DsySkeleton],
  templateUrl: './skeleton-example.html',
  styleUrl: './skeleton-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkeletonExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
}
