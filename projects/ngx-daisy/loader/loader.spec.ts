import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DsyLoader } from './public-api';

@Component({
  standalone: true,
  imports: [DsyLoader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<dsy-loader
    class="consumer-loader"
    [variant]="variant()"
    [placement]="placement()"
    [size]="size()"
    [color]="color()"
    [animation]="animation()"
    [speed]="speed()"
    [active]="active()"
    [showLabel]="showLabel()"
    [aria-label]="label()"
    [value]="value()"
  />`,
})
class DsyTestLoaderHost {
  readonly variant = signal<'spinner' | 'ring' | 'bar' | 'dots'>('spinner');
  readonly placement = signal<'inline' | 'overlay' | 'page'>('inline');
  readonly size = signal<'xs' | 'md' | 'xl'>('md');
  readonly color = signal<'inherit' | 'primary' | 'error'>('inherit');
  readonly animation = signal<'auto' | 'spin' | 'pulse' | 'none'>('auto');
  readonly speed = signal<'slow' | 'normal' | 'fast'>('normal');
  readonly active = signal(true);
  readonly showLabel = signal(false);
  readonly label = signal('Loading');
  readonly value = signal<number | null>(null);
}

@Component({
  standalone: true,
  imports: [DsyLoader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <dsy-loader data-case="attributes" active showLabel />
    <dsy-loader data-case="false-strings" active="false" showLabel="false" />
    <dsy-loader data-case="hidden-label" showLabel="false" />
  `,
})
class DsyTestLoaderBooleanHost {}

describe('DsyLoader', () => {
  it('announces an indeterminate status with real label text and hides its decorative artwork', async () => {
    const fixture = TestBed.createComponent(DsyLoader);
    await fixture.whenStable();
    const loader: HTMLElement = fixture.nativeElement;

    expect(loader.getAttribute('role')).toBe('status');
    expect(loader.getAttribute('aria-label')).toBe('Loading');
    expect(loader.textContent).toContain('Loading');
    expect(loader.hasAttribute('hidden')).toBe(false);
    expect(loader.hasAttribute('aria-valuenow')).toBe(false);
    expect(loader.hasAttribute('aria-valuemin')).toBe(false);
    expect(loader.hasAttribute('aria-valuemax')).toBe(false);
    expect(loader.getAttribute('data-determinate')).not.toBe('true');
    const artwork = loader.querySelector('[aria-hidden="true"]');
    expect(artwork).not.toBeNull();
    expect(artwork?.textContent).not.toContain('Loading');
    expect(loader.querySelector('.dsy-loader-label-visible')).toBeNull();
    expect(loader.getAttribute('data-variant')).toBe('spinner');
    expect(loader.getAttribute('data-placement')).toBe('inline');
    expect(loader.getAttribute('data-size')).toBe('md');
    expect(loader.getAttribute('data-color')).toBe('inherit');
    expect(loader.getAttribute('data-animation')).toBe('auto');
    expect(loader.getAttribute('data-speed')).toBe('normal');
  });

  it('updates the accessible and visible labels with trimmed text and a useful blank-label fallback', async () => {
    const fixture = TestBed.createComponent(DsyTestLoaderHost);
    await fixture.whenStable();
    const loader: HTMLElement = fixture.nativeElement.querySelector('dsy-loader');

    fixture.componentInstance.label.set('  Uploading report  ');
    fixture.componentInstance.showLabel.set(true);
    await fixture.whenStable();
    const label = loader.querySelector('.dsy-loader-label-visible');
    expect(loader.getAttribute('aria-label')).toBe('Uploading report');
    expect(label?.textContent?.trim()).toBe('Uploading report');
    expect(label?.closest('[aria-hidden="true"]')).toBeNull();

    fixture.componentInstance.label.set('  \n  ');
    await fixture.whenStable();
    expect(loader.getAttribute('aria-label')).toBe('Loading');
    expect(loader.querySelector('.dsy-loader-label-visible')?.textContent?.trim()).toBe('Loading');

    fixture.componentInstance.showLabel.set(false);
    await fixture.whenStable();
    expect(loader.querySelector('.dsy-loader-label-visible')).toBeNull();
    expect(loader.textContent).toContain('Loading');
  });

  it('represents zero and clamped progress consistently in accessible values and the bar artwork', async () => {
    const fixture = TestBed.createComponent(DsyTestLoaderHost);
    fixture.componentInstance.variant.set('bar');
    for (const [value, expected] of [
      [0, 0],
      [37.5, 37.5],
      [-20, 0],
      [125, 100],
    ]) {
      fixture.componentInstance.value.set(value);
      await fixture.whenStable();
      const loader: HTMLElement = fixture.nativeElement.querySelector('dsy-loader');
      const fill: HTMLElement | null = loader.querySelector('.dsy-loader-bar-value');

      expect(loader.getAttribute('role')).toBe('progressbar');
      expect(loader.getAttribute('aria-valuemin')).toBe('0');
      expect(loader.getAttribute('aria-valuemax')).toBe('100');
      expect(loader.getAttribute('aria-valuenow')).toBe(String(expected));
      expect(loader.getAttribute('data-determinate')).toBe('true');
      expect(fill?.style.width).toBe(`${expected}%`);
      expect(fill?.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('renders ring progress using the same normalized value exposed to assistive technology', async () => {
    const fixture = TestBed.createComponent(DsyTestLoaderHost);
    fixture.componentInstance.variant.set('ring');
    fixture.componentInstance.value.set(64.25);
    await fixture.whenStable();
    const loader: HTMLElement = fixture.nativeElement.querySelector('dsy-loader');
    const indicator = loader.querySelector('.dsy-loader-ring-value');

    expect(loader.getAttribute('role')).toBe('progressbar');
    expect(loader.getAttribute('aria-valuenow')).toBe('64.25');
    expect(indicator?.getAttribute('stroke-dasharray')).toBe('64.25 100');
    expect(indicator?.closest('[aria-hidden="true"]')).not.toBeNull();

    fixture.componentInstance.value.set(200);
    await fixture.whenStable();
    expect(loader.getAttribute('aria-valuenow')).toBe('100');
    expect(indicator?.getAttribute('stroke-dasharray')).toBe('100 100');
  });

  it('reacts to variant and progress changes and removes numerical semantics when progress becomes unknown', async () => {
    const fixture = TestBed.createComponent(DsyTestLoaderHost);
    fixture.componentInstance.variant.set('ring');
    fixture.componentInstance.value.set(25);
    await fixture.whenStable();
    const loader: HTMLElement = fixture.nativeElement.querySelector('dsy-loader');
    expect(loader.querySelector('.dsy-loader-ring-value')).not.toBeNull();

    fixture.componentInstance.variant.set('bar');
    fixture.componentInstance.value.set(75);
    await fixture.whenStable();
    expect(loader.querySelector('.dsy-loader-ring-value')).toBeNull();
    expect(loader.querySelector<HTMLElement>('.dsy-loader-bar-value')?.style.width).toBe('75%');
    expect(loader.getAttribute('aria-valuenow')).toBe('75');

    fixture.componentInstance.value.set(null);
    fixture.componentInstance.variant.set('dots');
    await fixture.whenStable();
    expect(loader.getAttribute('role')).toBe('status');
    expect(loader.getAttribute('data-variant')).toBe('dots');
    expect(loader.getAttribute('data-determinate')).not.toBe('true');
    expect(loader.hasAttribute('aria-valuenow')).toBe(false);
    expect(loader.hasAttribute('aria-valuemin')).toBe(false);
    expect(loader.hasAttribute('aria-valuemax')).toBe(false);
    expect(loader.textContent).toContain('Loading');
  });

  it('removes an inactive page loader from view and accessibility, then restores its current progress', async () => {
    const fixture = TestBed.createComponent(DsyTestLoaderHost);
    fixture.componentInstance.placement.set('page');
    fixture.componentInstance.variant.set('bar');
    fixture.componentInstance.value.set(45);
    await fixture.whenStable();
    const loader: HTMLElement = fixture.nativeElement.querySelector('dsy-loader');
    expect(loader.querySelector('.dsy-loader-content')).not.toBeNull();

    fixture.componentInstance.active.set(false);
    await fixture.whenStable();
    expect(loader.hidden).toBe(true);
    expect(loader.hasAttribute('hidden')).toBe(true);
    expect(loader.hasAttribute('role')).toBe(false);
    expect(loader.hasAttribute('aria-valuenow')).toBe(false);
    expect(loader.hasAttribute('aria-valuemin')).toBe(false);
    expect(loader.hasAttribute('aria-valuemax')).toBe(false);
    expect(loader.querySelector('.dsy-loader-content')).toBeNull();
    expect(loader.querySelector('.dsy-loader-bar-value')).toBeNull();

    fixture.componentInstance.value.set(80);
    fixture.componentInstance.active.set(true);
    await fixture.whenStable();
    expect(loader.hidden).toBe(false);
    expect(loader.getAttribute('role')).toBe('progressbar');
    expect(loader.getAttribute('aria-valuenow')).toBe('80');
    expect(loader.querySelector<HTMLElement>('.dsy-loader-bar-value')?.style.width).toBe('80%');
  });

  it('updates styling options through host data attributes while preserving consumer classes', async () => {
    const fixture = TestBed.createComponent(DsyTestLoaderHost);
    await fixture.whenStable();
    const loader: HTMLElement = fixture.nativeElement.querySelector('dsy-loader');

    fixture.componentInstance.placement.set('overlay');
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.animation.set('pulse');
    fixture.componentInstance.speed.set('slow');
    await fixture.whenStable();
    expect(loader.getAttribute('data-placement')).toBe('overlay');
    expect(loader.getAttribute('data-size')).toBe('xl');
    expect(loader.getAttribute('data-color')).toBe('primary');
    expect(loader.getAttribute('data-animation')).toBe('pulse');
    expect(loader.getAttribute('data-speed')).toBe('slow');
    expect(loader.classList.contains('consumer-loader')).toBe(true);

    fixture.componentInstance.placement.set('inline');
    fixture.componentInstance.size.set('xs');
    fixture.componentInstance.color.set('error');
    fixture.componentInstance.animation.set('none');
    fixture.componentInstance.speed.set('fast');
    await fixture.whenStable();
    expect(loader.getAttribute('data-placement')).toBe('inline');
    expect(loader.getAttribute('data-size')).toBe('xs');
    expect(loader.getAttribute('data-color')).toBe('error');
    expect(loader.getAttribute('data-animation')).toBe('none');
    expect(loader.getAttribute('data-speed')).toBe('fast');
  });

  it('supports boolean attributes and treats literal false strings as false', async () => {
    const fixture = TestBed.createComponent(DsyTestLoaderBooleanHost);
    await fixture.whenStable();
    const enabled: HTMLElement = fixture.nativeElement.querySelector('[data-case="attributes"]');
    const disabled: HTMLElement = fixture.nativeElement.querySelector(
      '[data-case="false-strings"]',
    );
    const hiddenLabel: HTMLElement = fixture.nativeElement.querySelector(
      '[data-case="hidden-label"]',
    );

    expect(enabled.hidden).toBe(false);
    expect(enabled.querySelector('.dsy-loader-label-visible')?.textContent?.trim()).toBe('Loading');
    expect(disabled.hidden).toBe(true);
    expect(disabled.querySelector('.dsy-loader-content')).toBeNull();
    expect(disabled.hasAttribute('role')).toBe(false);
    expect(hiddenLabel.getAttribute('role')).toBe('status');
    expect(hiddenLabel.querySelector('.dsy-loader-label-visible')).toBeNull();
    expect(hiddenLabel.textContent).toContain('Loading');
  });

  it.each([NaN, Infinity, -Infinity])('rejects non-finite progress values (%s)', (value) => {
    const fixture = TestBed.createComponent(DsyLoader);
    fixture.componentRef.setInput('variant', 'bar');
    fixture.componentRef.setInput('value', value);
    expect(() => fixture.detectChanges()).toThrowError(/finite|NaN|Infinity/i);
  });

  it.each(['spinner', 'dots'])('rejects determinate progress for the %s variant', (variant) => {
    const fixture = TestBed.createComponent(DsyLoader);
    fixture.componentRef.setInput('variant', variant);
    fixture.componentRef.setInput('value', 50);
    expect(() => fixture.detectChanges()).toThrowError(/bar|ring|determinate|support/i);
  });
});
