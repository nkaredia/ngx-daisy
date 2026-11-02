import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

/** Shared page identity; examples and component-specific guidance stay page-owned. */
@Component({
  selector: 'demo-documentation-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="component-page-header">
      <div class="component-page-import">
        <span>{{ category() }}</span
        ><code translate="no">{{ entryPoint() }}</code>
      </div>
      <h1 [id]="headingId()">{{ title() }}</h1>
      <p class="component-page-description"><ng-content /></p>
      @if (reference(); as url) {
        <a class="link" [href]="url" target="_blank" rel="noreferrer">
          daisyUI reference<span class="sr-only"> (opens in a new tab)</span>
        </a>
      }
    </header>
  `,
})
export class DocumentationHeader {
  readonly title = input.required<string>();
  readonly headingId = input.required<string>();
  readonly category = input.required<string>();
  readonly entryPoint = input.required<string>();
  readonly reference = input<string>();
}
