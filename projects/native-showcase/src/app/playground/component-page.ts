import { NativeSectionNavigation, nativeDocumentationSections } from './section-navigation';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { View, ScrollView } from '@nativescript/core';
import { DsyButton } from '@ngx-daisy/native/button';
import { NativeExampleCode } from './example-code';
import { NativePlayground } from './playground.component';
import type { NativePlaygroundConfig } from './types';
@Component({
  selector: 'app-native-component-page',
  standalone: true,
  imports: [NativePlayground, NativeExampleCode, NativeSectionNavigation, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<GridLayout [columns]="wide() ? '*, 160' : '*'">
    <StackLayout>
      <Label
        [text]="title()"
        class="text-[28px] font-bold mb-2"
        textWrap="true"
        accessibilityRole="header"
      ></Label>
      <Label [text]="description()" class="text-[16px] opacity-65 mb-4" textWrap="true"></Label>
      <Label
        [text]="'@ngx-daisy/native/' + entrypoint()"
        class="text-[12px] font-semibold bg-base-200 rounded-selector p-2 mb-6"
        horizontalAlignment="left"
      ></Label>
      @if (!wide() && !externalNavigation()) {
        <ScrollView orientation="horizontal" class="mb-4"
          ><StackLayout orientation="horizontal">
            @for (section of sections; track section.id) {
              <Button
                dsyButton
                [text]="section.label"
                variant="ghost"
                size="sm"
                (pressed)="scrollTo(section.id)"
              ></Button>
            }</StackLayout
        ></ScrollView>
      }
      <Label
        #trySection
        text="Try it out"
        class="text-[22px] font-bold mb-2"
        accessibilityRole="header"
      ></Label>
      <Label
        text="Change the inputs to explore appearance and state. Open the code panel for the complete Angular example."
        class="opacity-65 mb-4"
        textWrap="true"
      ></Label>
      <app-native-playground [config]="config()" [width]="bodyWidth()" [dark]="dark()" />
      <Label
        #examplesSection
        text="UI examples"
        class="text-[22px] font-bold mb-2"
        accessibilityRole="header"
      ></Label>
      <Label
        text="Explore real application scenarios and common variations."
        class="opacity-65 mb-5"
        textWrap="true"
      ></Label>
      <StackLayout class="native-inline-preview mb-5">
        <Label text="Common variations" class="font-semibold p-4"></Label>
        <StackLayout class="p-4"><ng-content /></StackLayout>
        <app-native-example-code [files]="inlineFiles()" [dark]="dark()" />
      </StackLayout>
      <Label
        #usageSection
        text="Angular usage"
        class="text-[22px] font-bold mt-8 mb-3"
        accessibilityRole="header"
      ></Label>
      <Label
        [text]="
          'Import the standalone components from @ngx-daisy/native/' +
          entrypoint() +
          ' into your Angular component. The example source above includes the actual imports and NativeScript markup.'
        "
        textWrap="true"
        class="opacity-75 mb-3"
      ></Label>
      <Label
        [text]="
          formControl()
            ? 'Use Angular Signal Forms for schema constraints, validation and disabled state. Keep each form value in a signal; local changes survive unrelated playground property edits.'
            : 'Use signal inputs for appearance and explicit outputs for actions. Keep application data, navigation and lifecycle decisions in your own component.'
        "
        textWrap="true"
        class="opacity-75 mb-3"
      ></Label>
      <Label
        text="Place native overlays beneath a RootLayout host. Theme scopes inherit from dsyTheme; apps can override host styles and exposed internal slots with native properties and utility classes."
        textWrap="true"
        class="opacity-75"
      ></Label>
      <Label
        #apiSection
        text="API reference"
        class="text-[22px] font-bold mt-8 mb-3"
        accessibilityRole="header"
      ></Label>
      @for (component of config().components; track $index) {
        <Label [text]="component.name ?? 'Component'" class="font-bold mb-3"></Label>
        @for (prop of component.props ?? []; track prop.property) {
          <StackLayout class="native-api-row py-3">
            <Label
              [text]="prop.name + (prop.required ? ' · required' : '')"
              class="font-semibold"
              textWrap="true"
            ></Label>
            <Label [text]="prop.type" class="text-[12px] opacity-65 mt-1" textWrap="true"></Label>
            @if (prop.description) {
              <Label [text]="prop.description" class="text-[13px] mt-1" textWrap="true"></Label>
            }
          </StackLayout>
        }
      }
      <Label
        #accessibilitySection
        text="Accessibility"
        class="text-[22px] font-bold mt-8 mb-3"
        accessibilityRole="header"
      ></Label>
      <Label
        text="Give interactive controls meaningful labels and explicit dismissal actions for overlays. Keep decorative icons and placeholders outside screen-reader traversal. Test your app with VoiceOver, TalkBack, large text and system reduced motion."
        textWrap="true"
        class="opacity-75 mb-6"
      ></Label>
    </StackLayout>
    @if (wide()) {
      <StackLayout col="1" class="ml-5"
        ><app-native-section-navigation (selected)="scrollTo($event)"
      /></StackLayout>
    }
  </GridLayout>`,
  styles: [
    `
      .native-inline-preview {
        border-width: 1;
        border-color: var(--color-base-300);
        border-radius: var(--radius-box);
      }
      .native-api-row {
        border-bottom-width: 1;
        border-bottom-color: var(--color-base-300);
      }
      .native-section-link {
        text-align: left;
        font-size: 13;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeComponentPage {
  readonly page = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly config = input.required<NativePlaygroundConfig>();
  readonly width = input(360);
  readonly dark = input(false);
  readonly externalNavigation = input(false);
  readonly sectionChange = output<string>();
  readonly wide = computed(() => !this.externalNavigation() && this.width() >= 1000);
  readonly bodyWidth = computed(() => this.width() - (this.wide() ? 180 : 0));
  readonly entrypoint = computed(
    () =>
      ({
        buttons: 'button',
        dropdowns: 'dropdown',
        fabs: 'fab',
        modals: 'modal',
        swaps: 'swap',
        'theme-controllers': 'theme-controller',
        icons: 'icon',
        inputs: 'input',
        textareas: 'textarea',
        checkboxes: 'checkbox',
        radios: 'radio',
        ranges: 'range',
        selects: 'select',
        'form-fields': 'form-field',
        fieldsets: 'fieldset',
        toggles: 'toggle',
        cards: 'card',
        badges: 'badge',
        dividers: 'divider',
        alerts: 'alert',
        progress: 'progress',
        skeletons: 'skeleton',
      })[this.page() as 'buttons'],
  );
  readonly inlineFiles = computed(
    () =>
      this.config()
        .exampleSources?.find(
          (source) => source.component === this.config().inlinePreviews?.[0]?.component,
        )
        ?.files.filter((file) => file.language === 'html') ?? [],
  );
  readonly formControl = computed(() =>
    [
      'inputs',
      'textareas',
      'checkboxes',
      'radios',
      'ranges',
      'selects',
      'toggles',
      'form-fields',
      'fieldsets',
    ].includes(this.page()),
  );
  readonly sections = nativeDocumentationSections;
  private readonly trySection = viewChild<ElementRef<View>>('trySection');
  private readonly examplesSection = viewChild<ElementRef<View>>('examplesSection');
  private readonly usageSection = viewChild<ElementRef<View>>('usageSection');
  private readonly apiSection = viewChild<ElementRef<View>>('apiSection');
  private readonly accessibilitySection = viewChild<ElementRef<View>>('accessibilitySection');
  scrollTo(section: string): void {
    this.sectionChange.emit(section);
    const view = (
      {
        try: this.trySection(),
        examples: this.examplesSection(),
        usage: this.usageSection(),
        api: this.apiSection(),
        accessibility: this.accessibilitySection(),
      } as Record<string, ElementRef<View> | undefined>
    )[section]?.nativeElement;
    let ancestor = view?.parent as View | undefined;
    while (ancestor && typeof (ancestor as ScrollView).scrollToVerticalOffset !== 'function')
      ancestor = ancestor.parent as View | undefined;
    if (ancestor && view) {
      const scroll = ancestor as ScrollView;
      const location = view.getLocationRelativeTo(scroll.content as View);
      if (location) scroll.scrollToVerticalOffset(Math.max(0, location.y - 16), true);
    }
  }
}
