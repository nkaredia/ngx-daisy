import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DsyIcon } from './public-api';

@Component({
  selector: 'dsy-test-native-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<svg [attr.data-glyph]="glyph()" [attr.data-weight]="weight()">
    <path d="M2 12h20" />
  </svg>`,
})
class DsyTestNativeIcon {
  readonly glyph = input.required<string>();
  readonly weight = input(1);
}

@Component({
  standalone: true,
  imports: [DsyIcon, DsyTestNativeIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<dsy-icon
    class="consumer-icon"
    [size]="size()"
    [color]="color()"
    [aria-label]="label()"
  >
    <dsy-test-native-icon class="native-icon" [glyph]="glyph()" [weight]="weight()" />
  </dsy-icon>`,
})
class DsyTestIconHost {
  readonly size = signal('1em');
  readonly color = signal<'inherit' | 'primary' | 'success'>('inherit');
  readonly label = signal<string | undefined>(undefined);
  readonly glyph = signal('house');
  readonly weight = signal(2);
}

@Component({
  standalone: true,
  imports: [DsyIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<dsy-icon [size]="size()" [color]="color()">
    @if (showSvg()) {
      <svg
        data-custom="true"
        class="consumer-svg"
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
      >
        <title>Custom house</title>
        <path d="M2 16 16 2l14 14v14H2z" />
      </svg>
    } @else {
      <span data-placeholder="true">Pending</span>
    }
  </dsy-icon>`,
})
class DsyTestCustomContentHost {
  readonly size = signal('1em');
  readonly color = signal<'inherit' | 'primary'>('inherit');
  readonly showSvg = signal(true);
}

describe('DsyIcon', () => {
  it('renders without icon-library providers and inherits the surrounding text size by default', async () => {
    const fixture = TestBed.createComponent(DsyIcon);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement;

    expect(icon.classList.contains('dsy-icon')).toBe(true);
    expect(icon.style.getPropertyValue('--dsy-icon-size')).toBe('');
    expect(icon.childElementCount).toBe(0);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(icon.hasAttribute('aria-label')).toBe(false);
  });

  it('projects a native Angular icon component and preserves its own inputs and classes', async () => {
    const fixture = TestBed.createComponent(DsyTestIconHost);
    await fixture.whenStable();
    const nativeIcon: HTMLElement = fixture.nativeElement.querySelector('dsy-test-native-icon');
    const svg: SVGElement = nativeIcon.querySelector('svg')!;

    expect(svg.getAttribute('data-glyph')).toBe('house');
    expect(svg.getAttribute('data-weight')).toBe('2');
    expect(nativeIcon.classList.contains('native-icon')).toBe(true);

    fixture.componentInstance.glyph.set('check');
    fixture.componentInstance.weight.set(3);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('dsy-test-native-icon')).toBe(nativeIcon);
    expect(svg.getAttribute('data-glyph')).toBe('check');
    expect(svg.getAttribute('data-weight')).toBe('3');
  });

  it('preserves arbitrary projected SVG content when wrapper size and color change', async () => {
    const fixture = TestBed.createComponent(DsyTestCustomContentHost);
    await fixture.whenStable();
    const svg: SVGElement = fixture.nativeElement.querySelector('dsy-icon > svg');

    expect(svg.getAttribute('viewBox')).toBe('0 0 32 32');
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('32');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.querySelector('title')?.textContent).toBe('Custom house');
    const originalContent = svg.outerHTML;

    fixture.componentInstance.size.set('2rem');
    fixture.componentInstance.color.set('primary');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('dsy-icon > svg')).toBe(svg);
    expect(svg.outerHTML).toBe(originalContent);
  });

  it('reacts to size and semantic color changes without replacing the projected icon', async () => {
    const fixture = TestBed.createComponent(DsyTestIconHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('dsy-icon');
    const nativeIcon = icon.querySelector('dsy-test-native-icon');

    fixture.componentInstance.size.set('24px');
    fixture.componentInstance.color.set('primary');
    await fixture.whenStable();
    expect(icon.style.getPropertyValue('--dsy-icon-size')).toBe('24px');
    expect(icon.classList.contains('dsy-icon-primary')).toBe(true);
    expect(icon.classList.contains('consumer-icon')).toBe(true);

    fixture.componentInstance.size.set('1.5rem');
    fixture.componentInstance.color.set('success');
    await fixture.whenStable();
    expect(icon.style.getPropertyValue('--dsy-icon-size')).toBe('1.5rem');
    expect(icon.classList.contains('dsy-icon-primary')).toBe(false);
    expect(icon.classList.contains('dsy-icon-success')).toBe(true);

    fixture.componentInstance.color.set('inherit');
    await fixture.whenStable();
    expect(icon.classList.contains('dsy-icon-success')).toBe(false);
    expect(icon.classList.contains('consumer-icon')).toBe(true);
    expect(icon.querySelector('dsy-test-native-icon')).toBe(nativeIcon);
  });

  it('exposes a trimmed accessible label and returns to decorative behavior when it is cleared', async () => {
    const fixture = TestBed.createComponent(DsyTestIconHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('dsy-icon');

    fixture.componentInstance.label.set('  Completed  ');
    await fixture.whenStable();
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Completed');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);

    fixture.componentInstance.label.set('  \n  ');
    await fixture.whenStable();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(icon.hasAttribute('aria-label')).toBe(false);

    fixture.componentInstance.label.set(undefined);
    await fixture.whenStable();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(icon.hasAttribute('aria-label')).toBe(false);
  });

  it('updates projected runtime content created by Angular control flow', async () => {
    const fixture = TestBed.createComponent(DsyTestCustomContentHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('dsy-icon');
    expect(icon.querySelector('svg[data-custom]')).not.toBeNull();

    fixture.componentInstance.showSvg.set(false);
    await fixture.whenStable();
    expect(icon.querySelector('svg')).toBeNull();
    expect(icon.querySelector('[data-placeholder]')?.textContent).toBe('Pending');

    fixture.componentInstance.showSvg.set(true);
    await fixture.whenStable();
    expect(icon.querySelector('[data-placeholder]')).toBeNull();
    expect(icon.querySelector('svg title')?.textContent).toBe('Custom house');
  });
});
