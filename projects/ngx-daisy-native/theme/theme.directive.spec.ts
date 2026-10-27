import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DSY_DARK_THEME, DSY_LIGHT_THEME } from '@ngx-daisy/core/theme';
import { DsyTheme } from './theme.directive';
import { resolveNativeTheme } from './native-theme';

@Component({
  imports: [DsyTheme],
  template: `<section [dsyTheme]="theme()" [rootFontSize]="fontSize()">
    <div [dsyTheme]="nested"></div>
  </section>`,
})
class Host {
  readonly theme = signal(DSY_LIGHT_THEME);
  readonly fontSize = signal(16);
  readonly nested = DSY_DARK_THEME;
}

describe('Native theme scope bindings', () => {
  it('reacts to theme and font reference changes without overwriting a nested scope', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const scope: HTMLElement = fixture.nativeElement.querySelector('section');
    const nested: HTMLElement = scope.querySelector('div')!;
    const dark = resolveNativeTheme(DSY_DARK_THEME);
    expect(scope.style.getPropertyValue('--color-base-100')).toBe('rgba(255, 255, 255, 1)');
    expect(nested.style.getPropertyValue('--color-base-100')).toBe(dark.tokens['--color-base-100']);
    fixture.componentInstance.theme.set(DSY_DARK_THEME);
    fixture.componentInstance.fontSize.set(20);
    fixture.detectChanges();
    expect(scope.style.getPropertyValue('--color-base-100')).toBe(dark.tokens['--color-base-100']);
    expect(scope.style.getPropertyValue('--radius-field')).toBe('5');
    expect(nested.style.getPropertyValue('--radius-field')).toBe('4');
  });
});
