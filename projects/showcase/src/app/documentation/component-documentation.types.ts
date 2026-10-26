import type { PlaygroundSourceFile } from '../playground/playground.types';
import type { DocumentationSection } from './documentation.types';

export interface DocumentationApiNote {
  readonly name: string;
  readonly description: string;
}
export interface ComponentDocumentationContent {
  readonly id: string;
  readonly entryPoint: string;
  readonly summary: string;
  readonly usage: readonly string[];
  readonly angular: readonly string[];
  readonly styling: readonly string[];
  readonly accessibility: readonly string[];
  readonly apiNotes: readonly DocumentationApiNote[];
  readonly files: readonly PlaygroundSourceFile[];
}
export function componentDocumentationSections(id: string): readonly DocumentationSection[] {
  return [
    { id: `${id}-overview`, label: 'Overview' },
    { id: `${id}-examples`, label: 'UI examples' },
    { id: `${id}-angular`, label: 'Angular usage' },
    { id: `${id}-styling`, label: 'Styling' },
    { id: `${id}-api`, label: 'API' },
    { id: `${id}-accessibility`, label: 'Accessibility' },
  ];
}
