import { DsyRating } from 'ngx-daisy/rating';
import type { Playground } from '../playground/playground.types';
import { RatingExample } from './example/rating-example';

export const playground: Playground = {
  components: [{ class: DsyRating /** Generate props during build */ }],
  previews: [RatingExample],
};
