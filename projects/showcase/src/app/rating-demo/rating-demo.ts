import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './rating-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyRating } from '@ngx-daisy/cdk/rating';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-rating-demo',
  standalone: true,
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    FormField,
    ReactiveFormsModule,
    DsyRating,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rating-demo.html',
  styleUrl: './rating-demo.scss',
})
export class RatingDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly model = signal<{ value: number | null }>({ value: 3 });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<number | null>(3.5);
}
