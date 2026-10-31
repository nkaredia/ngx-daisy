import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/native/button';
export const nativeDocumentationSections = [
  { id: 'try', label: 'Try it out' },
  { id: 'examples', label: 'UI examples' },
  { id: 'usage', label: 'Angular usage' },
  { id: 'api', label: 'API reference' },
  { id: 'accessibility', label: 'Accessibility' },
] as const;
@Component({
  selector: 'app-native-section-navigation',
  standalone: true,
  imports: [DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<StackLayout
    ><Label
      text="On this page"
      class="text-[13px] font-semibold mb-3"
      accessibilityRole="header"
    ></Label>
    @for (section of sections; track section.id) {
      <Button
        dsyButton
        [text]="section.label"
        [active]="active() === section.id"
        size="sm"
        variant="ghost"
        class="native-section-link"
        (pressed)="selected.emit(section.id)"
      ></Button>
    }
  </StackLayout>`,
  styles: [
    `
      .native-section-link {
        text-align: left;
        font-size: 13;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeSectionNavigation {
  readonly sections = nativeDocumentationSections;
  readonly active = input('try');
  readonly selected = output<string>();
}
