# Calendars

See the [Data Input integration and API guide](../../../docs/data-inputs.md) for Angular forms, composition, accessibility and customization.

## daisyUI alignment

The Angular calendar now renders daisyUI's `react-day-picker` visual hooks without a React or DayPicker runtime. Include `calendar` in daisyUI CSS. Angular still owns date-only arithmetic, Signal Forms, disabled/readonly state and keyboard navigation. Provider part names (`rdp-*`) skip the daisyUI prefix but receive Tailwind's namespace; the root follows both configured prefixes. Native selected/today/disabled/outside-day styles and 2.25rem day geometry are used. Narrow containers scroll within the calendar rather than clipping days.
