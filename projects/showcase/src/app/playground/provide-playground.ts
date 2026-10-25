import { InjectionToken, type Provider } from '@angular/core';
import type { Playground } from './playground.types';

export const PLAYGROUND_CONFIGURATIONS = new InjectionToken<readonly Playground[]>(
  'Showcase playground configurations',
);

/** Register metadata once on the page; each playground selects it by preview class identity. */
export function providePlayground(...configurations: readonly Playground[]): Provider[] {
  return configurations.map((configuration) => ({
    provide: PLAYGROUND_CONFIGURATIONS,
    multi: true,
    useValue: configuration,
  }));
}
