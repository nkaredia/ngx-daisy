import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DsyButton, DsyButtonColor } from './public-api';

@Component({
  imports: [DsyButton],
  template: `<button
    dsyButton
    type="button"
    class="custom"
    [color]="color()"
    [disabled]="disabled()"
    (click)="clicks = clicks + 1"
  >
    Save
  </button>`,
})
class Host {
  readonly color = signal<DsyButtonColor>('primary');
  readonly disabled = signal(false);
  clicks = 0;
}

describe('DsyButton', () => {
  it('updates signal inputs without Zone.js and preserves consumer classes and content', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent?.trim()).toBe('Save');
    expect(button.classList.contains('btn-primary')).toBe(true);
    fixture.componentInstance.color.set('success');
    await fixture.whenStable();
    expect(button.classList.contains('btn-primary')).toBe(false);
    expect(button.classList.contains('btn-success')).toBe(true);
    expect(button.classList.contains('custom')).toBe(true);
  });
  it('uses native disabled behavior to prevent activation', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
    button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });
});

@Component({
  imports: [DsyButton],
  styles: `
    .app-foreground {
      --d-btn-rest-fg: rebeccapurple;
    }
  `,
  template: `<button dsyButton color="secondary" [variant]="variant()">Contrast</button>
    <button dsyButton color="secondary" variant="outline" [style.--d-btn-rest-fg]="'rebeccapurple'">
      App foreground
    </button>
    <button dsyButton color="secondary" variant="outline" class="app-foreground">
      CSS foreground
    </button>`,
})
class ContrastHost {
  readonly variant = signal<'outline' | 'soft' | 'link'>('outline');
}

describe('DsyButton contrast hooks', () => {
  it('namespaces native hooks and removes them when changing to an unchanged variant', async () => {
    const { provideDaisyUI } = await import('@ngx-daisy/cdk/config');
    TestBed.configureTestingModule({
      providers: [provideDaisyUI({ prefix: 'd-', tailwindPrefix: 'tw' })],
    });
    const fixture = TestBed.createComponent(ContrastHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.style.getPropertyValue('--d-btn-rest-fg')).toBe(
      'var(--dsy-color-secondary-text)',
    );
    expect(button.style.getPropertyValue('--btn-rest-fg')).toBe('');
    fixture.componentInstance.variant.set('soft');
    await fixture.whenStable();
    expect(button.style.getPropertyValue('--d-btn-rest-fg')).toBe('');
    expect(button.style.getPropertyValue('--d-btn-color')).toBe('');
    fixture.componentInstance.variant.set('link');
    await fixture.whenStable();
    expect(button.style.getPropertyValue('--d-btn-color')).toBe(
      'var(--dsy-color-secondary-text, var(--color-secondary))',
    );
  });

  it('preserves explicit application foreground bindings above default host styling', async () => {
    const { provideDaisyUI } = await import('@ngx-daisy/cdk/config');
    TestBed.configureTestingModule({ providers: [provideDaisyUI({ prefix: 'd-' })] });
    const fixture = TestBed.createComponent(ContrastHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('button')[1];
    expect(button.style.getPropertyValue('--d-btn-rest-fg')).toBe('rebeccapurple');
    const cssButton: HTMLButtonElement = fixture.nativeElement.querySelectorAll('button')[2];
    expect(cssButton.style.getPropertyValue('--d-btn-rest-fg')).toBe('');
    expect(getComputedStyle(cssButton).getPropertyValue('--d-btn-rest-fg').trim()).toBe(
      'rebeccapurple',
    );
  });
});
