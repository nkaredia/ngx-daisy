import { LucideDynamicIcon, LucideCode, LucideCopy } from '@lucide/angular';
import { DsyIcon } from '@ngx-daisy/cdk/icon';
import { DsyTooltip } from '@ngx-daisy/cdk/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyTabs, DsyTab, DsyTabPanel } from '@ngx-daisy/cdk/tabs';
import type { PlaygroundSourceFile } from './playground.types';

let nextCodeId = 0;

@Component({
  selector: 'demo-example-code',
  imports: [LucideDynamicIcon, DsyIcon, DsyTooltip, DsyButton, DsyTabs, DsyTab, DsyTabPanel],
  templateUrl: './example-code.html',
  styleUrl: './example-code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ExampleCode {
  readonly icons = {
    code: LucideCode,
    copy: LucideCopy,
  };
  readonly files = input.required<readonly PlaygroundSourceFile[]>();
  readonly expanded = model(false);
  readonly showToggle = input(true);
  readonly selectedIndex = linkedSignal({ source: this.files, computation: () => 0 });
  readonly selectedFile = computed(() => this.files()[this.selectedIndex()] ?? this.files()[0]);
  readonly copyStatus = linkedSignal({ source: this.selectedFile, computation: () => '' });
  readonly bodyId = `example-code-${nextCodeId++}`;
  private readonly clipboard = inject(Clipboard);

  copy(file: PlaygroundSourceFile): void {
    try {
      this.copyStatus.set(
        this.clipboard.copy(file.content) ? 'Copied.' : 'Copy failed. Select the code to copy it.',
      );
    } catch {
      this.copyStatus.set('Copy failed. Select the code to copy it.');
    }
  }
}
