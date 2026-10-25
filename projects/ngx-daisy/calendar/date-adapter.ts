import { inject, Injectable, LOCALE_ID } from '@angular/core';
/** Date-only ISO values avoid UTC/local offset changes when binding forms. */
@Injectable({ providedIn: 'root' })
export class DsyDateAdapter {
  readonly locale = inject(LOCALE_ID);
  parse(value: string | null | undefined): Date | null {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(value + 'T12:00:00Z');
    return Number.isFinite(date.getTime()) && this.iso(date) === value ? date : null;
  }
  iso(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
  today(): string {
    const now = new Date();
    return `${now.getFullYear().toString().padStart(4, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  }
  addDays(value: string, days: number): string {
    const date = this.parse(value)!;
    date.setUTCDate(date.getUTCDate() + days);
    return this.iso(date);
  }
  addMonths(value: string, months: number): string {
    const date = this.parse(value)!;
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + months);
    const end = new Date(date);
    end.setUTCMonth(end.getUTCMonth() + 1, 0);
    date.setUTCDate(Math.min(day, end.getUTCDate()));
    return this.iso(date);
  }
  format(value: string, options: Intl.DateTimeFormatOptions, locale = this.locale): string {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
      this.parse(value)!,
    );
  }
}
