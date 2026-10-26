import type { PlaygroundSourceFile } from '../playground/playground.types';

export const setup: readonly PlaygroundSourceFile[] = [
  {
    path: 'save-button.ts',
    language: 'typescript',
    content: `import { Component, signal } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'app-save-button',
  imports: [DsyButton],
  template: \`
    <button dsyButton color="primary" [loading]="saving()" (click)="save()">
      {{ saving() ? 'Saving…' : 'Save changes' }}
    </button>
    <span role="status">{{ message() }}</span>
  \`,
})
export class SaveButton {
  readonly saving = signal(false);
  readonly message = signal('');

  async save() {
    if (this.saving()) return;
    this.saving.set(true);
    this.message.set('');
    try {
      // Replace this with your application's save request.
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      this.message.set('Changes saved.');
    } catch {
      this.message.set('Changes could not be saved. Try again.');
    } finally {
      this.saving.set(false);
    }
  }
}`,
  },
];
export const navigation: readonly PlaygroundSourceFile[] = [
  {
    path: 'navigation.ts',
    language: 'typescript',
    content: `import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'app-project-navigation',
  imports: [DsyButton, RouterLink],
  template: \`
    <a dsyButton routerLink="/projects" variant="outline">Projects</a>
    <a dsyButton href="https://daisyui.com" target="_blank" rel="noreferrer">
      daisyUI documentation
    </a>
  \`,
})
export class ProjectNavigation {}`,
  },
];
export const form: readonly PlaygroundSourceFile[] = [
  {
    path: 'project-form.ts',
    language: 'typescript',
    content: `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'app-project-form',
  imports: [DsyButton, ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Project name <input formControlName="name" /></label>
      <button dsyButton type="submit" color="primary" [disabled]="form.invalid">
        Create project
      </button>
    </form>
  \`,
})
export class ProjectForm {
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit() {
    if (this.form.invalid) return;
    // Send this.form.getRawValue() to your application service.
  }
}`,
  },
];
export const styling: readonly PlaygroundSourceFile[] = [
  {
    path: 'button-styling.html',
    language: 'html',
    content: `<!-- Inherit the active theme's semantic primary color. -->
<button dsyButton color="primary" variant="soft">Save changes</button>

<!-- Omit size so responsive daisyUI size classes can take effect. -->
<button dsyButton class="btn-sm md:btn-lg">Responsive button</button>

<!-- Theme scopes also apply to projected content. -->
<section data-theme="cupcake">
  <button dsyButton color="secondary" layout="block">Continue</button>
</section>`,
  },
];
