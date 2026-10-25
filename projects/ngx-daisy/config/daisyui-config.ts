import { inject, InjectionToken, Provider } from '@angular/core';

export interface DsyDaisyUIConfig {
  /** Match the prefix option in @plugin "daisyui". */
  readonly prefix?: string;
  /** Match Tailwind's prefix(tw), without the colon. */
  readonly tailwindPrefix?: string;
}

export const DSY_DAISYUI_CONFIG = new InjectionToken<Readonly<DsyDaisyUIConfig>>(
  'DsyDaisyUIConfig',
  { providedIn: 'root', factory: () => Object.freeze({}) },
);

/** Configures rendered class names. CSS plugin configuration stays in the app's stylesheet. */
export function provideDaisyUI(config: DsyDaisyUIConfig = {}): Provider {
  for (const [name, value] of Object.entries(config)) {
    if (value !== undefined && (typeof value !== 'string' || /\s|:/.test(value))) {
      throw new Error(`provideDaisyUI: ${name} must be a class prefix without spaces or colons.`);
    }
  }
  return { provide: DSY_DAISYUI_CONFIG, useValue: Object.freeze({ ...config }) };
}

/** Use in an injection context when projecting dynamically named daisyUI classes. */
export function injectDaisyUIClassName(): (name: string) => string {
  const { prefix = '', tailwindPrefix = '' } = inject(DSY_DAISYUI_CONFIG);
  const namespace = `${tailwindPrefix ? `${tailwindPrefix}:` : ''}${prefix}`;
  return (name) => `${namespace}${name}`;
}

/** Class-list formatter that also preserves daisyUI's unnamespaced conditional selectors. */
export function injectDaisyUIClasses(): (...names: string[]) => string {
  const className = injectDaisyUIClassName();
  const { prefix = '', tailwindPrefix = '' } = inject(DSY_DAISYUI_CONFIG);
  return (...names) =>
    names
      .filter(Boolean)
      .flatMap((name) =>
        tailwindPrefix ? [className(name), `${prefix}${name}`] : [className(name)],
      )
      .join(' ');
}
