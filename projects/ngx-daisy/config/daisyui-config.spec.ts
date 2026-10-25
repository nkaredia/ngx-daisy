import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideDaisyUI, injectDaisyUIClassName } from '@ngx-daisy/cdk/config';
import { DsyButton } from '../button/button.component';
import { DsyDrawerContainer } from '../drawer/drawer-container.component';
import { DsyDrawerContent } from '../drawer/drawer-content.component';
import { DsyDrawer } from '../drawer/drawer.component';

@Component({
  imports: [DsyButton, DsyDrawerContainer, DsyDrawerContent, DsyDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dsy-drawer-container class="app-layout">
    <dsy-drawer-content
      ><button dsyButton class="app-button" [color]="color()" size="lg" variant="outline">
        Open
      </button></dsy-drawer-content
    >
    <dsy-drawer
      #drawer
      mode="side"
      [position]="position()"
      [panelClass]="panelClass()"
      backdropClass="app-backdrop"
      >Navigation</dsy-drawer
    >
  </dsy-drawer-container>`,
})
class ConfigHost {
  readonly color = signal<'primary' | 'success'>('primary');
  readonly position = signal<'start' | 'end'>('start');
  readonly panelClass = signal('app-panel bg-primary rounded-box');
  readonly drawer = viewChild.required(DsyDrawer);
}

describe('daisyUI configuration', () => {
  for (const [name, config, namespace] of [
    ['defaults', {}, ''],
    ['daisyUI prefix', { prefix: 'd-' }, 'd-'],
    ['Tailwind prefix', { tailwindPrefix: 'tw' }, 'tw:'],
    ['both prefixes', { prefix: 'd-', tailwindPrefix: 'tw' }, 'tw:d-'],
  ] as const) {
    it(`renders ${name} consistently across components and preserves app classes`, async () => {
      TestBed.configureTestingModule({ providers: [provideDaisyUI(config)] });
      const fixture = TestBed.createComponent(ConfigHost);
      await fixture.whenStable();
      const root = fixture.nativeElement as HTMLElement;
      const button = root.querySelector('button')!;
      const container = root.querySelector('dsy-drawer-container')!;
      const content = root.querySelector('dsy-drawer-content')!;
      const drawer = root.querySelector('dsy-drawer')!;
      const toggle = root.querySelector<HTMLInputElement>('.dsy-drawer-toggle')!;

      for (const name of ['btn', 'btn-primary', 'btn-lg', 'btn-outline']) {
        expect(button.classList.contains(namespace + name)).toBe(true);
      }
      expect(button.classList.contains('app-button')).toBe(true);
      expect(container.classList.contains(namespace + 'drawer')).toBe(true);
      expect(container.classList.contains('app-layout')).toBe(true);
      expect(content.classList.contains(namespace + 'drawer-content')).toBe(true);
      expect(drawer.classList.contains(namespace + 'drawer-side')).toBe(true);
      expect(
        root
          .querySelector('.dsy-drawer-backdrop')!
          .classList.contains(namespace + 'drawer-overlay'),
      ).toBe(true);
      expect(toggle.classList.contains(namespace + 'drawer-toggle')).toBe(true);
      expect(toggle.checked).toBe(false);
      expect(toggle.hidden && toggle.disabled && toggle.tabIndex === -1).toBe(true);
      if ('tailwindPrefix' in config) {
        const prefix = 'prefix' in config ? config.prefix : '';
        // daisyUI's conditional selectors keep their non-Tailwind class names.
        expect(button.classList.contains(prefix + 'btn')).toBe(true);
        expect(button.classList.contains(prefix + 'btn-outline')).toBe(true);
        expect(toggle.classList.contains(prefix + 'drawer-toggle')).toBe(true);
        expect(drawer.classList.contains(prefix + 'drawer-side')).toBe(true);
      }

      fixture.componentInstance.color.set('success');
      fixture.componentInstance.position.set('end');
      fixture.componentInstance.drawer().open();
      await fixture.whenStable();
      expect(button.classList.contains(namespace + 'btn-primary')).toBe(false);
      expect(button.classList.contains(namespace + 'btn-success')).toBe(true);
      expect(button.classList.contains('app-button')).toBe(true);
      expect(container.classList.contains(namespace + 'drawer-open')).toBe(true);
      expect(container.classList.contains(namespace + 'drawer-end')).toBe(true);
      expect(toggle.checked).toBe(true);
      fixture.componentInstance.drawer().close();
      await fixture.whenStable();
      expect(toggle.checked).toBe(false);
    });
  }

  it('keeps panel and backdrop classes available for consumer styling', async () => {
    const fixture = TestBed.createComponent(ConfigHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const panel = root.querySelector('.dsy-drawer-panel')!;
    expect(panel.classList.contains('app-panel')).toBe(true);
    expect(panel.classList.contains('bg-primary')).toBe(true);
    expect(root.querySelector('.dsy-drawer-backdrop')!.classList.contains('app-backdrop')).toBe(
      true,
    );
    fixture.componentInstance.panelClass.set('next-panel text-error');
    await fixture.whenStable();
    expect(panel.classList.contains('app-panel')).toBe(false);
    expect(panel.classList.contains('next-panel')).toBe(true);
    expect(panel.classList.contains('dsy-drawer-panel')).toBe(true);
  });

  it('uses daisyUI default sizing without adding a conflicting size class', async () => {
    const fixture = TestBed.createComponent(DsyButton);
    await fixture.whenStable();
    expect(fixture.nativeElement.classList.contains('btn')).toBe(true);
    expect(fixture.nativeElement.classList.contains('btn-md')).toBe(false);
  });

  it('copies provider options so later mutation cannot silently change configured class names', () => {
    const options = { prefix: 'd-' };
    TestBed.configureTestingModule({ providers: [provideDaisyUI(options)] });
    options.prefix = 'changed-';
    const name = TestBed.runInInjectionContext(injectDaisyUIClassName);
    expect(name('btn')).toBe('d-btn');
  });

  it('rejects prefixes containing separate class tokens or a Tailwind separator', () => {
    expect(() => provideDaisyUI({ prefix: 'd- other' })).toThrowError(/prefix/);
    expect(() => provideDaisyUI({ tailwindPrefix: 'tw:' })).toThrowError(/tailwindPrefix/);
  });
});
