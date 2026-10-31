import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyAlert } from '@ngx-daisy/native/alert';
import { DsyProgress } from '@ngx-daisy/native/progress';
import { DsySkeleton } from '@ngx-daisy/native/skeleton';
import { DsyCard, DsyCardBody, DsyCardTitle } from '@ngx-daisy/native/card';
import { DsyButton } from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-feedback-example',
  standalone: true,
  imports: [DsyAlert, DsyProgress, DsySkeleton, DsyCard, DsyCardBody, DsyCardTitle, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    @switch (family()) {
      @case ('alerts') {
        <StackLayout
          dsyAlert
          [dsyColor]="restored() ? 'success' : 'warning'"
          variant="soft"
          [title]="restored() ? 'Back in sync' : 'You are offline'"
          [message]="
            restored()
              ? 'Your latest changes are safely stored.'
              : 'Keep working. Your changes will sync when you reconnect.'
          "
          class="mb-6"
        >
          <Button
            dsyButton
            [text]="restored() ? 'Try offline state' : 'Reconnect'"
            variant="outline"
            [dsyColor]="restored() ? 'success' : 'warning'"
            horizontalAlignment="left"
            marginTop="12"
            (pressed)="restored.set(!restored())"
          ></Button>
        </StackLayout>
        <Label
          text="Status messages"
          class="text-[20px] font-bold mb-3"
          accessibilityRole="header"
        ></Label>
        @for (status of statuses; track status.color) {
          <StackLayout
            dsyAlert
            [dsyColor]="status.color"
            [title]="status.title"
            [message]="status.message"
            announcement="off"
            class="mb-4"
          />
        }
        <StackLayout
          dsyAlert
          dsyColor="info"
          variant="outline"
          title="Your data stays yours"
          message="Export your workspace anytime from account settings."
          announcement="off"
        />
      }
      @case ('progress') {
        <StackLayout dsyCard border="solid" class="mb-6"
          ><StackLayout dsyCardBody>
            <Label dsyCardTitle text="Preparing your workspace"></Label>
            <Label
              text="Moving your projects into their new home."
              textWrap="true"
              class="opacity-70 mb-5"
            ></Label>
            <GridLayout columns="*, auto" class="mb-2">
              <Label
                [text]="progress() === 100 ? 'All files uploaded' : 'Uploading project files'"
                textWrap="true"
              ></Label>
              <Label col="1" [text]="progress() + '%'" class="font-bold ml-2"></Label>
            </GridLayout>
            <GridLayout
              dsyProgress
              [value]="progress()"
              [dsyColor]="progress() === 100 ? 'success' : 'primary'"
              label="Project file upload"
              class="mb-5"
            />
            <Label
              [text]="
                progress() === 100
                  ? 'Your workspace is ready.'
                  : 'You can keep working while this finishes.'
              "
              textWrap="true"
              class="opacity-70 mb-4"
            ></Label>
            <Button
              dsyButton
              [text]="progress() === 100 ? 'Start again' : 'Upload next batch'"
              dsyColor="primary"
              (pressed)="progress() === 100 ? progress.set(0) : advance()"
            ></Button> </StackLayout
        ></StackLayout>
        <Label
          text="Unknown duration"
          class="text-[20px] font-bold mb-3"
          accessibilityRole="header"
        ></Label>
        <GridLayout columns="auto, *" class="bg-base-200 rounded-box p-4 mb-6">
          <GridLayout
            dsyProgress
            label="Connecting to your workspace"
            dsyColor="primary"
            marginRight="16"
          />
          <Label
            col="1"
            text="Connecting to your workspace…"
            textWrap="true"
            verticalAlignment="middle"
          ></Label>
        </GridLayout>
        <Label
          text="Progress with a custom maximum"
          class="text-[20px] font-bold mb-3"
          textWrap="true"
          accessibilityRole="header"
        ></Label>
        <Label text="3 of 5 onboarding steps complete" textWrap="true" class="mb-2"></Label>
        <GridLayout
          dsyProgress
          [value]="3"
          [max]="5"
          dsyColor="success"
          label="Onboarding checklist"
        />
      }
      @case ('skeletons') {
        <Label
          text="Keep the shape of content visible while it loads. Announce the region once, rather than each placeholder."
          textWrap="true"
          class="opacity-70 mb-5"
        ></Label>
        <StackLayout dsyCard border="solid" class="mb-5"
          ><StackLayout dsyCardBody>
            @if (!loaded()) {
              <Label
                text="Loading your project overview"
                class="mb-4 opacity-70"
                accessibilityLiveRegion="polite"
              ></Label>
              <GridLayout columns="auto, *" class="mb-5">
                <StackLayout dsySkeleton shape="circle" [animate]="animate()" marginRight="16" />
                <StackLayout col="1" verticalAlignment="middle">
                  <StackLayout
                    dsySkeleton
                    shape="text"
                    width="70%"
                    horizontalAlignment="left"
                    [animate]="animate()"
                    marginBottom="8"
                  />
                  <StackLayout
                    dsySkeleton
                    shape="text"
                    width="45%"
                    horizontalAlignment="left"
                    [animate]="animate()"
                  />
                </StackLayout>
              </GridLayout>
              <StackLayout dsySkeleton height="140" [animate]="animate()" marginBottom="20" />
              <StackLayout dsySkeleton shape="text" [animate]="animate()" marginBottom="10" />
              <StackLayout
                dsySkeleton
                shape="text"
                width="80%"
                horizontalAlignment="left"
                [animate]="animate()"
              />
            } @else {
              <Label dsyCardTitle text="Welcome back, Alex"></Label>
              <Label
                text="Your next chapter starts here."
                textWrap="true"
                class="opacity-70 mb-4"
              ></Label>
              <StackLayout class="bg-primary rounded-box p-5 mb-4">
                <Label
                  text="Studio refresh"
                  class="text-primary-content text-[22px] font-bold"
                  textWrap="true"
                ></Label>
                <Label
                  text="12 tasks complete · Ready for review"
                  class="text-primary-content mt-2"
                  textWrap="true"
                ></Label>
              </StackLayout>
              <Label
                text="Everything is ready for your team. Share feedback, collect ideas and keep moving forward."
                textWrap="true"
              ></Label>
            }</StackLayout
        ></StackLayout>
        <Button
          dsyButton
          [text]="loaded() ? 'Show loading state' : 'Load example content'"
          dsyColor="primary"
          (pressed)="loaded.set(!loaded())"
          class="mb-2"
        ></Button>
        <Button
          dsyButton
          [text]="animate() ? 'Pause pulse' : 'Enable pulse'"
          variant="ghost"
          [disabled]="loaded()"
          (pressed)="animate.set(!animate())"
        ></Button>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeFeedbackExample {
  readonly family = input.required<'alerts' | 'progress' | 'skeletons'>();
  readonly restored = signal(false);
  readonly progress = signal(35);
  readonly loaded = signal(false);
  readonly animate = signal(true);
  readonly statuses = [
    {
      color: 'info',
      title: 'A little heads-up',
      message: 'Your next invoice will be ready on November 1.',
    },
    {
      color: 'success',
      title: 'Changes saved',
      message: 'Your workspace is up to date across all devices.',
    },
    {
      color: 'warning',
      title: 'Almost at your limit',
      message: 'You have used 85% of your storage. Make room before your next upload.',
    },
    {
      color: 'error',
      title: 'Payment needs attention',
      message: 'Update your payment method to keep your subscription active.',
    },
  ] as const;
  advance(): void {
    this.progress.update((value) => Math.min(100, value + 15));
  }
}
