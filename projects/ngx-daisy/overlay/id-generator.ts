import { Injectable } from '@angular/core';
/** Application-scoped IDs keep independently bootstrapped apps and SSR requests isolated. */
@Injectable({ providedIn: 'root' })
export class DsyIdGenerator {
  private nextId = 0;
  next(prefix: string): string {
    return `${prefix}-${++this.nextId}`;
  }
}
