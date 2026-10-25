import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyFilter } from '@ngx-daisy/cdk/filter';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-filter-demo',
  standalone: true,
  imports: [Playground, FormField, ReactiveFormsModule, DsyFilter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './filter-demo.html',
  styleUrl: './filter-demo.scss',
})
export class FilterDemo {
  readonly playground = playground;
  readonly model = signal<{ value: string | null }>({ value: null });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<string | null>(null);
  readonly options = [
    { value: 'all', label: 'All projects' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ];
}
