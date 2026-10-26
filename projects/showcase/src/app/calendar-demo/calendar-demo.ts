import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './calendar-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyCalendar } from '@ngx-daisy/cdk/calendar';
import { DsyFormField } from '@ngx-daisy/cdk/form-field';
import { DsyInput } from '@ngx-daisy/cdk/input';
@Component({
  providers: providePlayground(playground),
  selector: 'demo-calendar-demo',
  standalone: true,
  imports: [
    DocumentationPage,
    ComponentDocumentation,
    Playground,
    FormField,
    ReactiveFormsModule,
    DsyFormField,
    DsyButton,
    DsyCalendar,
    DsyInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-demo.html',
  styleUrl: './calendar-demo.scss',
})
export class CalendarDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly model = signal<{ value: string | null }>({ value: '2026-10-20' });
  readonly fields = form(this.model);
  readonly reactive = new FormControl<string | null>('2026-10-23');
  readonly weekdaysOnly = (date: string) =>
    ![0, 6].includes(new Date(date + 'T12:00:00Z').getUTCDay());
}
