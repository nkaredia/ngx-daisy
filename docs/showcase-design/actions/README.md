# Actions showcase layout pass

Buttons remains the visual reference. This pass applies its page header, import identity, typography and spacing to Dropdowns, FAB / Speed Dial, Modals, Swaps and Theme Controllers. Each page distinguishes the interactive playground from its curated variations and retains its existing examples and API documentation.

The shared `_component-page.scss` preserves the Buttons styles while making them reusable. The existing right-hand documentation index now becomes a horizontally scrolling index below 1200px on all documentation pages.

Dropdowns adds two standalone, single-file inline examples: document commands and notification preferences. The shared split shell owns their framing and extracts HTML and supporting TypeScript in builder memory. The preference lives outside the transient panel, so reopening it preserves the chosen value. Provider icons use individual Lucide imports. No component library or native mobile implementation changed.

## Verification

- Production `yarn build` passed with the existing initial-bundle and theme-builder budget warnings.
- 36 showcase tests, four builder tests and 72 standalone documentation examples passed Angular template checking.
- Browser inspection covered the six Actions routes at 1440px and 375px: no document overflow, no missing section targets, and responsive section-index direction. See `layout-results.json`.
- Exercised the new document action menu, selected Duplicate and confirmed its status. Changed the notification preference, dismissed and reopened the panel, and confirmed the value persisted. Verified HTML and TypeScript source tabs.
- Screenshots capture Dropdowns in the existing dark theme at desktop/mobile widths and the new inline example layout.

Theme palettes, component sizes and syntax-highlighting themes were preserved. This was a layout and example pass, not renewed manual screen-reader or keyboard verification. The remaining categories still need their individual content/design pass; the existing Actions variation cards can also be migrated to extracted inline examples in later page passes.
