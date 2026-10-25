import { Directive, input, computed } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Directive({ selector: '[dsyMask]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyMask {
  readonly daisy = injectDaisyUIClasses();
  readonly shape = input<
    | 'squircle'
    | 'heart'
    | 'hexagon'
    | 'hexagon-2'
    | 'decagon'
    | 'pentagon'
    | 'diamond'
    | 'square'
    | 'circle'
    | 'star'
    | 'star-2'
    | 'triangle'
    | 'triangle-2'
    | 'triangle-3'
    | 'triangle-4'
  >('squircle');
  readonly half = input<'none' | 'first' | 'second'>('none');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'mask',
        {
          square: '',
          squircle: 'mask-squircle',
          heart: 'mask-heart',
          hexagon: 'mask-hexagon',
          'hexagon-2': 'mask-hexagon-2',
          decagon: 'mask-decagon',
          pentagon: 'mask-pentagon',
          diamond: 'mask-diamond',
          circle: 'mask-circle',
          star: 'mask-star',
          'star-2': 'mask-star-2',
          triangle: 'mask-triangle',
          'triangle-2': 'mask-triangle-2',
          'triangle-3': 'mask-triangle-3',
          'triangle-4': 'mask-triangle-4',
        }[this.shape()],
        { none: '', first: 'mask-half-1', second: 'mask-half-2' }[this.half()],
      ].filter(Boolean),
    ),
  );
}
