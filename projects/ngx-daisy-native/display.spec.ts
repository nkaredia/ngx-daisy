import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DsyBadge } from '@ngx-daisy/native/badge';
import { DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions } from '@ngx-daisy/native/card';
import { DsyDivider } from '@ngx-daisy/native/divider';

@Component({
  imports: [DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions, DsyBadge, DsyDivider],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <StackLayout dsyCard border="solid">
      <StackLayout dsyCardBody>
        <Label dsyCardTitle text="Delivery"></Label>
        <Label dsyBadge [text]="status()" dsyColor="success"></Label>
        <GridLayout dsyDivider [orientation]="orientation()" [text]="label()" [align]="align()" />
        <FlexboxLayout dsyCardActions
          ><button (click)="status.set('Delivered')">Track</button></FlexboxLayout
        >
      </StackLayout>
    </StackLayout>
  `,
})
class Host {
  readonly status = signal('In transit');
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly label = signal('');
  readonly align = signal<'center' | 'start' | 'end'>('center');
}

describe('Native display composition', () => {
  it('preserves projected actions and updates a noninteractive status without replacing content', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const action = fixture.nativeElement.querySelector('button');
    const badge = fixture.debugElement.query(By.directive(DsyBadge));
    expect(badge.nativeElement.text).toBe('In transit');
    action.click();
    fixture.detectChanges();
    expect(badge.nativeElement.text).toBe('Delivered');
    expect(fixture.nativeElement.querySelector('button')).toBe(action);
    expect(
      fixture.debugElement
        .query(By.directive(DsyCardTitle))
        .nativeElement.getAttribute('accessibilityRole'),
    ).toBe('header');
  });

  it('reflows a divider between labeled horizontal and vertical layouts without empty-label gaps', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const node = fixture.debugElement.query(By.directive(DsyDivider));
    const divider = node.injector.get(DsyDivider);
    expect(divider.columns()).toBe('*, 0, 0');
    expect(divider.rows()).toBe('auto');
    fixture.componentInstance.label.set('OR');
    fixture.componentInstance.align.set('start');
    fixture.detectChanges();
    expect(divider.columns()).toBe('16, auto, *');
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    expect(divider.rows()).toBe('16, auto, *');
    expect(divider.columns()).toBe('auto');
    expect(node.nativeElement.querySelector('label').row).toBe(1);
    expect(node.nativeElement.getAttribute('accessibilityHidden')).toBe('true');
    fixture.componentInstance.label.set('');
    fixture.detectChanges();
    expect(divider.rows()).toBe('*, 0, 0');
    expect(node.nativeElement.querySelector('label')).toBeNull();
  });
});
