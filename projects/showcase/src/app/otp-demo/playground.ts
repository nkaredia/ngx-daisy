import { DsyOtp } from '@ngx-daisy/cdk/otp';
import type { Playground } from '../playground/playground.types';
import { OtpExample } from './example/otp-example';

export const playground: Playground = {
  components: [{ class: DsyOtp /** Generate props during build */ }],
  previews: [OtpExample],
};
