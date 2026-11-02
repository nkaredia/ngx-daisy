# @ngx-daisy/cdk/toast

Standalone Angular toasts with daisyUI appearance. See the [component guide](../../../docs/remaining-components.md) for imports, APIs, examples and behavior. Showcase: `/toasts`.

## User-controlled interruptions

Apps can apply user preferences to the service instance that publishes their notifications:

```ts
const toasts = inject(DsyToastService);
toasts.setAccessibility({ announcements: 'polite', persistent: true });
```

`accessibility()` exposes the current read-only signal. `setAccessibility` merges partial updates. `announcements: 'off'` suppresses future live announcements, including messages requesting assertive announcements; `polite` de-escalates assertive announcements, while per-message `off` stays silent. `original` retains per-message behavior. Visible messages remain available for review. This does not retract announcements already queued/delivered by assistive technology or affect other live regions.

`persistent: true` cancels existing timers, including paused ones, and ignores expiry on future messages. Turning it off does not restart cancelled timers; only subsequent timed messages expire. Messages remain explicitly dismissible. The default is `persistent: false`, which retains per-message timing; omitted durations still persist as before.

Provide user-facing preference controls and apply stored preferences before publishing notifications. The showcase demonstrates quiet announcements and persistence controls. Preferences belong to each service instance: route/component providers are independent of the root service. Apps own storage, recovery of important messages, critical workflow alerts and any additional interruption channels. These APIs support WCAG 2.2.3/2.2.4 configurations, not whole-app AAA certification.
