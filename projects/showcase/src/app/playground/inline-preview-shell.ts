import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type Type,
  ViewEncapsulation,
} from '@angular/core';
import { InlinePreview } from './inline-preview';
import { ExampleCode } from './example-code';
import { PLAYGROUND_CONFIGURATIONS } from './provide-playground';

let nextInlinePreviewId = 0;

/** Showcase presentation stays outside the example source. */
@Component({
  selector: 'demo-inline-preview-shell',
  imports: [InlinePreview, ExampleCode],
  templateUrl: './inline-preview-shell.html',
  styleUrl: './inline-preview-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InlinePreviewShell {
  readonly component = input.required<Type<unknown>>();
  readonly title = input.required<string>();
  readonly showTypescript = input(false);
  private readonly configurations = inject(PLAYGROUND_CONFIGURATIONS, { optional: true }) ?? [];
  readonly sourceFiles = computed(
    () =>
      this.configurations
        .flatMap((config) => config.exampleSources ?? [])
        .find((source) => source.component === this.component())
        ?.files.filter(
          (file) =>
            file.language === 'html' || (this.showTypescript() && file.language === 'typescript'),
        ) ?? [],
  );
  readonly headingId = `inline-preview-heading-${nextInlinePreviewId++}`;
}
