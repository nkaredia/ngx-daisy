import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyHoverGallery } from 'ngx-daisy/hover-gallery';
export interface HoverGalleryExampleValues {
  readonly controls?: ReturnType<DsyHoverGallery['controls']>;
  readonly activeIndex?: ReturnType<DsyHoverGallery['activeIndex']>;
  readonly label?: ReturnType<DsyHoverGallery['label']>;
}
@Component({
  selector: 'demo-hover-gallery-example',
  standalone: true,
  imports: [DsyHoverGallery],
  templateUrl: './hover-gallery-example.html',
  styleUrl: './hover-gallery-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HoverGalleryExample {
  readonly values = input<readonly HoverGalleryExampleValues[]>([]);
  readonly props = computed<HoverGalleryExampleValues>(() => this.values()[0] ?? {});
  readonly images = [
    { src: '/display/mountain.svg', alt: 'Alpine landscape' },
    { src: '/display/coast.svg', alt: 'Coastal landscape' },
    { src: '/display/desert.svg', alt: 'Desert landscape' },
  ];
}
