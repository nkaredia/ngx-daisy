import { DsyHoverGallery } from '@ngx-daisy/cdk/hover-gallery';
import type { Playground } from '../playground/playground.types';
import { HoverGalleryExample } from './example/hover-gallery-example';
export const playground: Playground = {
  components: [{ class: DsyHoverGallery /** Generate props during build */ }],
  previews: [HoverGalleryExample],
};
