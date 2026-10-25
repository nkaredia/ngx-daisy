import { DsySkeleton } from '@ngx-daisy/cdk/skeleton';
import type { Playground } from '../playground/playground.types';
import { SkeletonExample } from './example/skeleton-example';

export const playground: Playground = {
  components: [{ class: DsySkeleton /** Generate props during build */ }],
  previews: [SkeletonExample],
};
