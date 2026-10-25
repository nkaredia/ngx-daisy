import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyRating } from 'ngx-daisy/rating';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-rating-demo',
  standalone: true,
  imports: [Playground, FormField, ReactiveFormsModule, DsyRating],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rating-demo.html',
  styleUrl: './rating-demo.scss',
})
export class RatingDemo {
  readonly playground = playground;
  readonly model = signal<{ value: number | null }>({ value: 3 });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<number | null>(3.5);
}
