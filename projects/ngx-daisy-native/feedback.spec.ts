import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DsyAlert } from '@ngx-daisy/native/alert';
import { DsyProgress } from '@ngx-daisy/native/progress';
import { DsySkeleton } from '@ngx-daisy/native/skeleton';
vi.mock('@nativescript/core', () => ({
  isIOS: true,
  Utils: {},
  Application: { on: vi.fn(), off: vi.fn() },
}));
afterEach(() => vi.unstubAllGlobals());

@Component({
  imports: [DsyAlert, DsyProgress, DsySkeleton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <StackLayout dsyAlert title="Connection" [message]="message()" [announcement]="announcement()">
      <button (click)="message.set('Connected')">Retry</button>
    </StackLayout>
    <GridLayout dsyProgress [value]="value()" [max]="max()" label="File upload" />
    <StackLayout dsySkeleton [animate]="animate()" [hidden]="hidden()" />
  `,
})
class Host {
  readonly message = signal('Offline');
  readonly announcement = signal<'off' | 'polite' | 'assertive'>('polite');
  readonly value = signal<number | null>(35);
  readonly max = signal(100);
  readonly animate = signal(true);
  readonly hidden = signal(false);
}

describe('Native feedback', () => {
  it('clamps finite progress, handles invalid bounds and switches to an OS busy indicator for unknown work', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const node = fixture.debugElement.query(By.directive(DsyProgress));
    const progress = node.injector.get(DsyProgress);
    expect(progress.accessibleValue()).toBe('35%');
    fixture.componentInstance.max.set(5);
    fixture.componentInstance.value.set(3);
    fixture.detectChanges();
    expect(progress.accessibleValue()).toBe('60%');
    fixture.componentInstance.value.set(12);
    fixture.detectChanges();
    expect(progress.safeValue()).toBe(5);
    fixture.componentInstance.value.set(-2);
    fixture.detectChanges();
    expect(progress.safeValue()).toBe(0);
    fixture.componentInstance.max.set(Number.NaN);
    fixture.componentInstance.value.set(Number.POSITIVE_INFINITY);
    fixture.detectChanges();
    expect(progress.safeMax()).toBe(100);
    expect(progress.safeValue()).toBeNull();
    expect(progress.accessibleValue()).toBe('In progress');
    expect(node.nativeElement.querySelector('activityindicator')).not.toBeNull();
    expect(node.nativeElement.querySelector('progress')).toBeNull();
    fixture.componentInstance.value.set(25);
    fixture.detectChanges();
    expect(node.nativeElement.querySelector('activityindicator')).toBeNull();
    // The browser test renderer uses HTMLProgressElement, whose value getter
    // clamps against HTML max rather than NativeScript's maxValue property.
    expect(node.nativeElement.querySelector('progress').getAttribute('value')).toBe('25');
    expect(node.nativeElement.querySelector('progress').maxValue).toBe(100);
  });

  it('keeps alert recovery actions interactive and updates the requested native live region', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const node = fixture.debugElement.query(By.directive(DsyAlert));
    node.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(node.injector.get(DsyAlert).message()).toBe('Connected');
    expect(node.nativeElement.querySelectorAll('label')[1].accessibilityLiveRegion).toBe('polite');
    fixture.componentInstance.announcement.set('off');
    fixture.detectChanges();
    expect(node.nativeElement.querySelectorAll('label')[1].accessibilityLiveRegion).toBe('none');
  });

  it('removes skeleton pulse on pause, hide and unload, and honors disabled native motion on reload', () => {
    vi.stubGlobal('UIAccessibilityIsReduceMotionEnabled', () => false);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const node = fixture.debugElement.query(By.directive(DsySkeleton));
    const skeleton = node.injector.get(DsySkeleton);
    expect(skeleton.classes()).not.toContain('animated');
    node.triggerEventHandler('loaded', {});
    fixture.detectChanges();
    expect(skeleton.classes()).toContain('animated');
    fixture.componentInstance.animate.set(false);
    fixture.detectChanges();
    expect(skeleton.classes()).not.toContain('animated');
    fixture.componentInstance.animate.set(true);
    fixture.componentInstance.hidden.set(true);
    fixture.detectChanges();
    expect(skeleton.classes()).not.toContain('animated');
    fixture.componentInstance.hidden.set(false);
    node.triggerEventHandler('unloaded', {});
    fixture.detectChanges();
    expect(skeleton.classes()).not.toContain('animated');
    vi.stubGlobal('UIAccessibilityIsReduceMotionEnabled', () => true);
    node.triggerEventHandler('loaded', {});
    fixture.detectChanges();
    expect(skeleton.classes()).not.toContain('animated');
    expect(node.nativeElement.getAttribute('accessibilityHidden')).toBe('true');
  });
});
