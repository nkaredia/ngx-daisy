// Portable contracts only: no web component/runtime imports enter the native app.
export type {
  Playground,
  PlaygroundProperty,
  PlaygroundValue,
  PlaygroundValues,
  PlaygroundSourceFile,
} from '@ngx-daisy/core/playground';
import type { Playground, PlaygroundValues } from '@ngx-daisy/core/playground';
export interface NativePlaygroundConfig extends Playground {
  readonly initialValues?: PlaygroundValues;
}
