import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { FormField, email, form, required } from '@angular/forms/signals';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { DsyFormField } from '@ngx-daisy/native/form-field';
import { DsyFieldset } from '@ngx-daisy/native/fieldset';
import { DsySelect, DsySelectOptionTemplate, type DsySelectOption } from '@ngx-daisy/native/select';
import { DsyInput } from '@ngx-daisy/native/input';
import { DsyToggle } from '@ngx-daisy/native/toggle';
import { DsyButton } from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-form-composition-example',
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    FormField,
    DsyFormField,
    DsyFieldset,
    DsySelect,
    DsySelectOptionTemplate,
    DsyInput,
    DsyToggle,
    DsyButton,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <StackLayout>
      @switch (family()) {
        @case ('selects') {
          <StackLayout
            dsyFieldset
            legend="Where should we send it?"
            description="Choose a destination for your Weekend essentials order."
            class="mb-5"
          >
            <StackLayout
              dsyFormField
              label="Delivery region"
              hint="Open the list to compare delivery estimates."
            >
              <GridLayout
                dsySelect
                [formField]="fields.region"
                [options]="regions"
                placeholder="Choose your region"
              >
                <ng-template dsySelectOption let-destination let-selected="selected">
                  <GridLayout columns="*, auto" class="mb-1">
                    <Label
                      [text]="destination.label"
                      [fontWeight]="selected ? '600' : '400'"
                      textWrap="true"
                    ></Label>
                    <Label
                      col="1"
                      [text]="destination.value.toUpperCase()"
                      class="text-xs text-primary ml-2"
                      verticalAlignment="middle"
                    ></Label>
                  </GridLayout>
                  <Label
                    [text]="destination.description"
                    class="text-xs opacity-60"
                    textWrap="true"
                  ></Label>
                </ng-template>
              </GridLayout>
            </StackLayout>
            <Label
              text="Choose a destination from the selection popover. Tap outside it to keep your current selection."
              class="text-sm opacity-60 mb-4"
              textWrap="true"
            ></Label>
            <Button
              dsyButton
              text="Clear selection"
              variant="ghost"
              dsyLayout="block"
              (pressed)="clearRegion()"
            ></Button>
          </StackLayout>
          <StackLayout class="bg-base-200 rounded-box p-5 mb-5"
            ><Label
              text="Delivery preferences"
              class="text-xl font-semibold mb-2"
              accessibilityRole="header"
            ></Label
            ><Label
              [text]="
                profile().region
                  ? 'Selected region: ' + profile().region.toUpperCase()
                  : 'A destination is still needed.'
              "
              class="text-primary font-semibold"
              textWrap="true"
            ></Label
            ><Label
              text="This preview does not place an order."
              class="text-sm opacity-60 mt-3"
              textWrap="true"
            ></Label
          ></StackLayout>
        }
        @case ('form-fields') {
          <StackLayout
            dsyFieldset
            legend="Make your profile feel like you"
            description="Labels, help and validation all stay connected to the Angular field."
            class="mb-5"
          >
            <StackLayout
              dsyFormField
              label="Display name"
              hint="Use the name your team knows you by."
            >
              <TextField
                dsyInput
                [formField]="fields.name"
                hint="Your name"
                autocapitalizationType="words"
                returnKeyType="next"
              ></TextField>
            </StackLayout>
            <StackLayout
              dsyFormField
              label="Email address"
              hint="Used for account updates and invitations."
            >
              <TextField
                dsyInput
                [formField]="fields.email"
                hint="you@example.com"
                keyboardType="email"
                autocapitalizationType="none"
                autocorrect="false"
                returnKeyType="done"
              ></TextField>
            </StackLayout>
            <Button
              dsyButton
              text="Save profile"
              dsyColor="primary"
              dsyLayout="block"
              (pressed)="save()"
            ></Button>
          </StackLayout>
          <StackLayout class="bg-base-200 rounded-box p-5 mb-5"
            ><Label
              text="Try the validation"
              class="text-xl font-semibold mb-2"
              accessibilityRole="header"
            ></Label
            ><Label
              text="Leave the name blank and save. Enter a name to see the error return to helpful guidance. Tap a field label to focus its control."
              class="opacity-75"
              textWrap="true"
            ></Label
          ></StackLayout>
        }
        @case ('fieldsets') {
          <StackLayout
            dsyFieldset
            legend="Delivery details"
            description="Everything we need to get your next adventure started."
            class="mb-5"
          >
            <StackLayout dsyFormField label="City" hint="The city on your delivery address."
              ><TextField
                dsyInput
                [formField]="fields.city"
                autocapitalizationType="words"
              ></TextField
            ></StackLayout>
            <StackLayout dsyFormField label="Region" hint="Delivery times vary by destination."
              ><GridLayout dsySelect [formField]="fields.region" [options]="regions"></GridLayout
            ></StackLayout>
          </StackLayout>
          <StackLayout
            dsyFieldset
            legend="Keep in touch"
            description="A separate group for your communication preferences."
            class="mb-5"
          >
            <StackLayout
              dsyFormField
              label="Contact email"
              hint="We will send your tracking link here."
              ><TextField
                dsyInput
                [formField]="fields.email"
                keyboardType="email"
                autocapitalizationType="none"
                autocorrect="false"
              ></TextField
            ></StackLayout>
            <StackLayout
              dsyFormField
              label="Project and delivery updates"
              hint="You can change this preference at any time."
              ><Switch dsyToggle [formField]="fields.updates" horizontalAlignment="left"></Switch
            ></StackLayout>
            <Button
              dsyButton
              text="Save preferences"
              dsyColor="primary"
              dsyLayout="block"
              (pressed)="save()"
            ></Button>
          </StackLayout>
        }
      }
      <Label
        [text]="message()"
        class="text-center opacity-60 mb-5"
        textWrap="true"
        accessibilityLiveRegion="polite"
      ></Label>
    </StackLayout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeFormCompositionExample {
  readonly family = input<'selects' | 'form-fields' | 'fieldsets'>('selects');
  readonly profile = signal({
    name: '',
    email: 'maya@example.com',
    region: 'us',
    city: 'Austin',
    updates: true,
  });
  readonly fields = form(this.profile, (path) => {
    required(path.name, { message: 'Tell us what your teammates should call you.' });
    required(path.email, { message: 'Enter your email address.' });
    email(path.email, { message: 'Use a valid email address, such as maya@example.com.' });
    required(path.region, { message: 'Choose a delivery region.' });
  });
  readonly regions: readonly DsySelectOption[] = [
    { value: 'us', label: 'United States', description: 'Standard delivery in 3–5 business days.' },
    { value: 'ca', label: 'Canada', description: 'Tracked delivery in 5–8 business days.' },
    { value: 'eu', label: 'Europe', description: 'Tracked delivery in 7–10 business days.' },
    {
      value: 'other',
      label: 'More destinations',
      description: 'Coming soon. Join our updates for new locations.',
      disabled: true,
    },
  ];
  readonly message = signal('Your changes stay in this demo.');
  save(): void {
    this.fields.name().markAsTouched();
    this.fields.email().markAsTouched();
    this.fields.region().markAsTouched();
    const valid =
      this.family() === 'form-fields'
        ? this.fields.name().valid() && this.fields.email().valid()
        : this.fields.email().valid() && this.fields.region().valid();
    this.message.set(valid ? 'Preferences saved for this demo.' : 'Check the highlighted fields.');
  }
  clearRegion(): void {
    this.profile.update((value) => ({ ...value, region: '' }));
    this.fields.region().markAsTouched();
  }
}
