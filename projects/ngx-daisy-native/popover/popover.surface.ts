import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  NO_ERRORS_SCHEMA,
  TemplateRef,
  ViewEncapsulation,
  computed,
  inject,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import type { View } from '@nativescript/core';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsyTheme, DSY_LIGHT_THEME } from '@ngx-daisy/native/theme';
import type { DsyPopoverConfig, DsyPopoverContent } from './popover.types';
import { ensurePopoverLayer } from './popover.layer';
import { positionPopover, type PopoverPosition } from './position';
export interface DsyPopoverData {
  content: DsyPopoverContent;
  config: DsyPopoverConfig;
  close(): void;
}
export const DSY_POPOVER_DATA = new InjectionToken<DsyPopoverData>('DsyPopoverData');
@Component({
  selector: 'dsy-native-popover-surface',
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet, DsyTheme, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<DsyPopoverLayer
    #overlay
    [dsyTheme]="theme()"
    [materialScheme]="theme().colorScheme"
    width="100%"
    height="100%"
    [iosOverflowSafeArea]="false"
    (layoutChanged)="reposition()"
    (dismissRequest)="data.close()"
  >
    <Button
      text=""
      class="dsy-native-popover-backdrop"
      [class]="data.config.backdropClass ?? ''"
      width="100%"
      height="100%"
      accessibilityLabel="Close popover"
      [accessible]="false"
      (tap)="data.close()"
    ></Button>
    <DsyPopoverPanel
      #panel
      class="dsy-native-popover-panel"
      [class]="data.config.panelClass ?? ''"
      [left]="position().left"
      [top]="position().top"
      [width]="position().width"
      [maxHeight]="position().maxHeight"
      [opacity]="ready() ? 1 : 0"
    >
      <ScrollView
        ><StackLayout class="dsy-native-popover-content" (layoutChanged)="measureContent($event)">
          <GridLayout columns="*, auto" class="dsy-native-popover-heading">
            <Label
              [text]="data.config.label ?? 'Actions'"
              textWrap="true"
              accessibilityRole="header"
              verticalAlignment="middle"
              class="dsy-native-popover-title"
            ></Label>
            <Button
              col="1"
              dsyButton
              text="×"
              size="xs"
              variant="ghost"
              shape="square"
              accessibilityLabel="Close popover"
              (pressed)="data.close()"
            ></Button>
          </GridLayout>
          @if (template) {
            <ng-container [ngTemplateOutlet]="template" />
          } @else {
            <ng-container
              [ngComponentOutlet]="component"
              [ngComponentOutletInjector]="data.config.injector"
            />
          }</StackLayout
      ></ScrollView>
    </DsyPopoverPanel>
  </DsyPopoverLayer>`,
  styleUrl: './popover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNativePopoverSurface {
  constructor() {
    ensurePopoverLayer();
  }
  readonly data = inject(DSY_POPOVER_DATA);
  readonly template = this.data.content instanceof TemplateRef ? this.data.content : null;
  readonly component = this.template
    ? null
    : (this.data.content as Exclude<DsyPopoverContent, TemplateRef<unknown>>);
  readonly overlay = viewChild<unknown, ElementRef<View>>('overlay', { read: ElementRef });
  readonly panel = viewChild<unknown, ElementRef<View>>('panel', { read: ElementRef });
  readonly position = signal<PopoverPosition>({
    left: 12,
    top: 12,
    width: 280,
    maxHeight: 360,
    side: 'bottom',
  });
  readonly ready = signal(false);
  private contentHeight?: number;
  anchor?: View;
  readonly theme = computed(() =>
    typeof this.data.config.theme === 'function'
      ? this.data.config.theme()
      : (this.data.config.theme ?? DSY_LIGHT_THEME),
  );
  measureContent(event: unknown): void {
    const height = (event as { object: View }).object.getActualSize()?.height;
    if (height && height !== this.contentHeight) {
      this.contentHeight = height;
      this.reposition();
    }
  }
  reposition(): void {
    const overlay = this.overlay()?.nativeElement;
    const anchor = this.anchor;
    const viewport = overlay?.getActualSize();
    const point = overlay && anchor?.getLocationRelativeTo(overlay);
    const size = anchor?.getActualSize();
    if (!point || !size || !viewport?.width || !viewport.height) return;
    const next = positionPopover({ ...point, ...size }, viewport, {
      ...this.data.config,
      contentHeight: this.contentHeight,
    });
    if (JSON.stringify(next) !== JSON.stringify(this.position())) this.position.set(next);
    this.ready.set(true);
  }
}
