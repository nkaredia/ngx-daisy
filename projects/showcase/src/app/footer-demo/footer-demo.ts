import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyFooter, DsyFooterTitle } from '@ngx-daisy/cdk/footer';

@Component({
  selector: 'demo-footer-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyFooter, DsyFooterTitle],
  templateUrl: './footer-demo.html',
  styleUrl: './footer-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FooterDemo {
  readonly playground = playground;
}
