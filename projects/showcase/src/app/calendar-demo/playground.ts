import { DsyCalendar } from '@ngx-daisy/cdk/calendar';
import type { Playground } from '../playground/playground.types';
import { CalendarExample } from './example/calendar-example';

export const playground: Playground = {
  components: [{ class: DsyCalendar /** Generate props during build */ }],
  previews: [CalendarExample],
};
