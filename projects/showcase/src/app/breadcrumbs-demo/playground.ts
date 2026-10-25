import { DsyBreadcrumbs } from 'ngx-daisy/breadcrumbs';
import type { Playground } from '../playground/playground.types';
import { BreadcrumbsExample } from './example/breadcrumbs-example';

export const playground: Playground = {
  components: [{ class: DsyBreadcrumbs /** Generate props during build */ }],
  previews: [BreadcrumbsExample],
};
