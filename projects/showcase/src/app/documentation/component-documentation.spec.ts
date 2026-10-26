import { TestBed } from '@angular/core/testing';
import { ComponentDocumentation } from './component-documentation';
import { ComponentDocumentationContent } from './component-documentation.types';
import { Playground } from '../playground/playground.types';

class ExampleControl {}
const content: ComponentDocumentationContent = {
  id: 'example',
  entryPoint: '@ngx-daisy/cdk/example',
  summary: 'Example control.',
  usage: ['Use a clear label.'],
  angular: ['Bind application state.'],
  styling: ['Inherit theme tokens.'],
  accessibility: ['Preserve focus visibility.'],
  apiNotes: [],
  files: [],
};
describe('ComponentDocumentation', () => {
  it('renders extracted aliases, models and defaults without executing default expressions', async () => {
    const fixture = TestBed.createComponent(ComponentDocumentation);
    fixture.componentRef.setInput('content', content);
    fixture.componentRef.setInput('playground', {
      components: [
        {
          class: ExampleControl,
          name: 'ExampleControl',
          props: [
            {
              name: 'aria-label',
              property: 'label',
              kind: 'input',
              type: 'string',
              required: true,
              optional: false,
              nullable: false,
              action: { kind: 'text' },
            },
            {
              name: 'opened',
              property: 'opened',
              kind: 'model',
              type: 'boolean',
              required: false,
              optional: false,
              nullable: false,
              default: false,
              action: { kind: 'toggle', options: [true, false] },
            },
            {
              name: 'id',
              property: 'id',
              kind: 'input',
              type: 'string',
              required: false,
              optional: false,
              nullable: false,
              defaultExpression: 'inject(IdGenerator).next()',
              action: { kind: 'text' },
            },
          ],
        },
      ],
      previews: [],
    } satisfies Playground);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('table')?.textContent).toContain('aria-label');
    expect(root.querySelector('table')?.textContent).toContain('Required');
    expect(root.querySelector('table')?.textContent).toContain('Two-way model');
    expect(root.querySelector('table')?.textContent).toContain('false');
    expect(root.querySelector('table')?.textContent).toContain('Resolved at runtime');
    expect(root.querySelector('table')?.textContent).not.toContain('inject(');
  });
  it('explains projection for declarations without inputs', async () => {
    const fixture = TestBed.createComponent(ComponentDocumentation);
    fixture.componentRef.setInput('content', content);
    fixture.componentRef.setInput('playground', {
      components: [{ class: ExampleControl, name: 'ExampleControl', props: [] }],
      previews: [],
    });
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('table')).toBeNull();
    expect(root.textContent).toContain('no configurable inputs');
  });
});
