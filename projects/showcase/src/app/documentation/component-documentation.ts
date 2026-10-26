import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { ExampleCode } from '../playground/example-code';
import type { Playground, PlaygroundProperty } from '../playground/playground.types';
import type { ComponentDocumentationContent } from './component-documentation.types';

@Component({
  selector: 'demo-component-documentation',
  imports: [ExampleCode],
  templateUrl: './component-documentation.html',
  styleUrl: './component-documentation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ComponentDocumentation {
  readonly content = input.required<ComponentDocumentationContent>();
  readonly playground = input.required<Playground>();

  defaultValue(property: PlaygroundProperty): string {
    if (property.required) return 'Required';
    if (Object.prototype.hasOwnProperty.call(property, 'default'))
      return JSON.stringify(property.default);
    if (!property.defaultExpression || property.defaultExpression === 'undefined')
      return 'undefined';
    if (/inject\(|next\(/.test(property.defaultExpression)) return 'Resolved at runtime';
    if (/=>/.test(property.defaultExpression)) return 'Function; see usage';
    return property.defaultExpression;
  }
}
