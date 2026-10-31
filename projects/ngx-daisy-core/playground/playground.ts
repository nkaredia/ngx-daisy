import type { Type } from '@angular/core';

export type PlaygroundLiteral = string | number | boolean;

/** `kind` selects the action component; its other fields configure that action. */
export type PlaygroundAction =
  | { readonly kind: 'select'; readonly options: readonly PlaygroundLiteral[] }
  | { readonly kind: 'toggle'; readonly options: readonly boolean[] }
  | { readonly kind: 'text' }
  | { readonly kind: 'number' }
  | { readonly kind: 'unsupported'; readonly reason: string };

export type PlaygroundActionKind = PlaygroundAction['kind'];

/** The playground renderer supplies an implementation for each supported action kind. */
export type PlaygroundActionComponents = {
  readonly [Kind in PlaygroundActionKind]: Type<unknown>;
};

export interface PlaygroundProperty {
  /** Public Angular input alias, used when binding the example. */
  readonly name: string;
  /** TypeScript member name, which can differ from the public alias. */
  readonly property: string;
  readonly kind: 'input' | 'model';
  readonly type: string;
  readonly acceptedType?: string;
  readonly required: boolean;
  /** Whether the value can be undefined, independently of whether the input is required. */
  readonly optional: boolean;
  readonly nullable: boolean;
  readonly values?: readonly PlaygroundLiteral[];
  readonly description?: string;
  readonly defaultExpression?: string;
  /** Only statically recognized literal defaults are included. Expressions are not executed. */
  readonly default?: PlaygroundLiteral | null;
  readonly action: PlaygroundAction;
}

export interface PlaygroundComponent {
  /** Stable source class name injected by the loader (not a bundled constructor name). */
  readonly name?: string;
  readonly class: Type<unknown>;
  /** Injected in memory by the build loader; absent from the authored object. */
  readonly props?: readonly PlaygroundProperty[];
}

export interface PlaygroundInlinePreview {
  /** Include the component TS when the template needs supporting behavior. */
  readonly showTypescript?: boolean;
  /** Showcase heading, intentionally kept out of the example source. */
  readonly title: string;
  readonly component: Type<unknown>;
}

export interface PlaygroundSourceToken {
  readonly content: string;
  readonly color?: string;
  readonly fontStyle?: number;
}

export interface PlaygroundSourceFile {
  readonly tokens?: readonly PlaygroundSourceToken[];
  /** Path relative to the example's directory; never an absolute build-machine path. */
  readonly path: string;
  readonly language: 'typescript' | 'html' | 'scss' | 'css';
  readonly content: string;
}

export interface PlaygroundExampleSource {
  readonly component: Type<unknown>;
  readonly files: readonly PlaygroundSourceFile[];
}

export interface Playground {
  /** Authored source snapshots injected by the loader, never written to this file. */
  readonly exampleSources?: readonly PlaygroundExampleSource[];
  readonly components: readonly PlaygroundComponent[];
  /** Example component classes, each declaring a values input receiving the full component-array state. */
  readonly previews: readonly Type<unknown>[];
  /** Compact standalone examples: rendered without property controls or injected values. */
  readonly inlinePreviews?: readonly PlaygroundInlinePreview[];
}

export type PlaygroundValue = PlaygroundLiteral | null | undefined;
export type PlaygroundComponentValues = Readonly<Record<string, PlaygroundValue>>;
export type PlaygroundValues = readonly PlaygroundComponentValues[];
export type PlaygroundPropsPosition = 'side' | 'bottom';
