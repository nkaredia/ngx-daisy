import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoaderDemo } from './loader-demo';

describe('LoaderDemo page preview', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('closes the page preview after two seconds and restarts its timeout on another preview', () => {
    const fixture = TestBed.createComponent(LoaderDemo);
    const demo = fixture.componentInstance;

    expect(demo.pageActive()).toBe(false);
    demo.previewPage();
    vi.advanceTimersByTime(1500);
    expect(demo.pageActive()).toBe(true);

    demo.previewPage();
    vi.advanceTimersByTime(1999);
    expect(demo.pageActive()).toBe(true);
    vi.advanceTimersByTime(1);
    expect(demo.pageActive()).toBe(false);
  });

  it('cancels the page preview timeout when the component is destroyed', () => {
    const fixture = TestBed.createComponent(LoaderDemo);
    const schedule = vi.spyOn(globalThis, 'setTimeout');
    const cancel = vi.spyOn(globalThis, 'clearTimeout');

    fixture.componentInstance.previewPage();
    const timer = schedule.mock.results.at(-1)?.value;
    fixture.destroy();

    expect(timer).toBeDefined();
    expect(cancel).toHaveBeenCalledWith(timer);
  });
});
