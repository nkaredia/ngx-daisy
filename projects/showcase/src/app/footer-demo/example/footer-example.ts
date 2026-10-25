import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyFooter, DsyFooterTitle } from '@ngx-daisy/cdk/footer';

interface FooterValues {
  readonly orientation?: ReturnType<DsyFooter['orientation']>;
  readonly center?: ReturnType<DsyFooter['center']>;
}

@Component({
  selector: 'demo-footer-example',
  standalone: true,
  imports: [DsyFooter, DsyFooterTitle],
  templateUrl: './footer-example.html',
  styleUrl: './footer-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FooterExample {
  readonly values = input<readonly [FooterValues?, Record<string, never>?]>([]);
  readonly props = computed<FooterValues>(() => this.values()[0] ?? {});
}
