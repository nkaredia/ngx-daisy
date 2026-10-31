import { nativeSourceText } from './formatted-source';
import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
  linkedSignal,
} from '@angular/core';
import { Utils } from '@nativescript/core';
import { Copy, Check } from 'lucide';
import { NativeIconButton } from '../shell/icon-button';
import { lucideArtwork } from '../icons/svg-artwork';
import { DsyButton } from '@ngx-daisy/native/button';
import type { PlaygroundSourceFile } from './types';
@Component({
  selector: 'app-native-example-code',
  standalone: true,
  imports: [NativeIconButton, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<StackLayout class="native-code bg-base-200">
    <ScrollView orientation="horizontal"
      ><StackLayout orientation="horizontal" class="px-3 py-2">
        @for (file of files(); track file.path; let index = $index) {
          <Button
            dsyButton
            [text]="file.path"
            size="sm"
            variant="ghost"
            [active]="selected() === index"
            [accessibilityLabel]="file.path + (selected() === index ? ', selected' : '')"
            (pressed)="selected.set(index)"
          ></Button>
        }</StackLayout
    ></ScrollView>
    @if (file(); as source) {
      <GridLayout columns="*, auto" class="px-3">
        <Label
          [text]="source.language"
          class="text-[12px] opacity-60"
          verticalAlignment="middle"
        ></Label>
        <GridLayout
          col="1"
          appIconButton
          [label]="copied() === source.path ? 'Copied' : 'Copy ' + source.path"
          [artwork]="copied() === source.path ? check : copy"
          (pressed)="copySource(source)"
        />
      </GridLayout>
      <TextView
        editable="false"
        height="300"
        class="native-code-text"
        [formattedText]="formatted()"
        [accessibilityLabel]="'Example source: ' + source.path"
      ></TextView>
    } @else {
      <Label text="Source is prepared during the native build." class="p-4" textWrap="true"></Label>
    }
  </StackLayout>`,
  styles: [
    `
      .native-code-text {
        font-family: monospace;
        font-size: 12;
        background-color: transparent;
        color: var(--color-base-content);
        border-width: 0;
        padding: 12;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeExampleCode {
  readonly files = input<readonly PlaygroundSourceFile[]>([]);
  readonly dark = input(false);
  readonly selected = linkedSignal({ source: this.files, computation: () => 0 });
  readonly file = computed(() => this.files()[this.selected()]);
  readonly copied = linkedSignal({ source: this.files, computation: () => '' });
  readonly copy = lucideArtwork(Copy);
  readonly check = lucideArtwork(Check);
  readonly formatted = computed(() => nativeSourceText(this.file(), this.dark()));
  copySource(file: PlaygroundSourceFile): void {
    Utils.copyToClipboard(file.content);
    this.copied.set(file.path);
  }
}
