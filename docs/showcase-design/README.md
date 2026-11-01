# Showcase page design reviews

Review component pages one at a time in the shared catalog order, starting with Buttons. Each pass should produce a concrete page that can be reviewed before its layout is copied across the catalog. Preserve the existing Angular architecture, daisyUI customization, generated playground/source extraction, right-hand section navigation and code palettes. Component colors and sizes remain frozen. Screen-reader and keyboard verification are parked at the user's request; do not represent a visual review as completing those audits.

## Research and installed skills

- [Carbon component guidance](https://v10.carbondesignsystem.com/contributing/component/) separates usage, style and code concerns. [Current Button guidance](https://www.carbondesignsystem.com/building-blocks/core/components/button/guidelines) puts examples alongside contextual usage decisions. Adapt the information hierarchy, not Carbon's visual language or React APIs.
- [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) supports exposing common tasks first and keeping secondary detail clearly reachable. Preserve visible static example source as previously requested; do not hide it merely to shorten the page.
- [daisyUI Button](https://daisyui.com/components/button/) remains the visual/API reference for the supported variants. The showcase should help users choose among them, not redesign them.
- [r/DesignSystems discussion](https://www.reddit.com/r/DesignSystems/comments/1wv77dq/how_and_what_do_you_document_for_usage_guidelines/) offers practitioner suggestions to explain when a pattern is appropriate and record decisions. Treat this as qualitative community input, not a usability study or authoritative standard.
- [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) is installed at `.agents/skills/frontend-design`. Use its hierarchy, content and deliberate-composition guidance within our existing theme/font system. Do not invent the hex palette or replacement fonts suggested for unconstrained new projects.
- [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) is installed at `.agents/skills/web-design-guidelines`. Review current upstream rules when applying it; interpret framework examples for Angular. Native HTML behavior, our Angular forms contracts, user decisions and daisyUI configuration take precedence over generic React-oriented examples.

Both skills were downloaded from official repositories through the skill-installer helper. Sources were reviewed before installation. The skills.sh listings showed approximately 1.1M frontend-design installs and 811.4K web-design-guidelines installs at review time; these are popularity signals, not correctness guarantees. The installer preserves upstream files. Existing skill lock entries are unchanged because this installer does not generate Skills CLI lock hashes.

## Buttons: first-page direction

Audience: application developers choosing a button treatment and integrating it into an Angular app. The page should answer “what should I use?” and “what do I copy?” before showing every configurable property.

Baseline issues (before the first pass):

- `button-demo.html:3`: the page begins with an h2 and moves into a large property editor before a minimal integration example.
- `button-demo.html:17`: playground controls dominate the opening experience even for a reader seeking a single native button.
- `button-demo.html:30`: variation headings group features but do not explain why a reader would choose them.
- `button-documentation.html:1`: the first complete Angular example arrives below every variation, requiring substantial scrolling for new users.

Composition:

```text
Buttons                         category / import
Short purpose statement         links to examples and API

Get started
Minimal native button + exact extracted HTML / component source

Choose the right control
Actions / navigation / emphasis guidance

Playground
Existing live product scenario + generated properties

Examples
Existing static variations + purpose-led descriptions

Angular integration / Styling / API / Accessibility
Existing deeper documentation and right-hand section navigation
```

Use the current theme's semantic tokens and existing typeface. Page typography, spacing and responsive composition may improve; do not change library control sizes or palettes. Favor left-aligned reading, short paragraphs and a restrained opening. Avoid decorative gradients, replacement branding, animated introductions and a wall of identical advice cards. Make no global shell or playground redesign in this first pass. Keep the right-hand index vertical on desktop; for Buttons only, use a horizontal scrolling index below 1200px so section links do not bury the introduction. Keep all existing examples, source tabs and section anchors available.

The initial alternative—a large decorative hero with repeated quick-link cards—was rejected because it delays the code and duplicates the persistent section navigation. The page's visual emphasis should come from an understandable live example and a clear reading sequence.

## First pass delivered

Buttons now leads with a page title, package identity and a generated-source starter example. A concise decision list explains actions, navigation and emphasis. The existing full playground and all five variation sets remain, with descriptive context. Deeper Angular integration, styling, API and accessibility guidance retain their anchors; their heading levels now follow the page hierarchy. The shared inline shell accepts optional editorial descriptions and puts HTML before optional supporting TypeScript, preserving exact source contents.

The change is scoped to Buttons, with the small shared shell extensions available for reuse. No library component styles, theme definitions, control sizes, font packages or highlighting palettes were changed. No additional animations were introduced.

## Validation and review artifacts

Production core/library/showcase builds pass, with the existing bundle and theme-builder style warnings. All 35 showcase tests, four builder tests and 72 documentation examples pass. The inline-source regression now checks that HTML remains the default when supporting TypeScript is requested. Route checks accept a page h1 followed by section headings and validate all eight Buttons section links.

[Theme/layout summary](buttons-validation.json) and [raw preset results](buttons-theme-results.json.gz) cover all 35 shipped themes at 1440px and 320px: 70 cases, no missing combinations and no document overflow. Existing contrast flags and incomplete checks remain in the evidence; colors/sizing are frozen, and this is not a new accessibility conformance audit. Native and manual screen-reader/keyboard verification were excluded.

Visual review: [before](buttons-before.jpg), [desktop after](buttons-after.jpg), [mobile after](buttons-mobile.jpg). The starter HTML and TypeScript tabs were inspected in the built page: HTML contains only the authored native button; TypeScript includes its actual DsyButton import and component declaration. All five original inline variation sets and the full interactive playground remain.

Next component in catalog order: Dropdowns. Review its content needs before copying the Buttons composition; a menu needs guidance about action items, navigation and custom content rather than button-emphasis advice.

The development showcase is running at `http://127.0.0.1:4401/`. An older offline service-worker cache was showing the previous Buttons page while that server was stopped. The current page was verified at `/buttons?ngsw-bypass=1`; this bypasses the old cache for the review without clearing offline application data.

## Second pass: example presentation

The user authorized richer page/example design. [The inline-example follow-up](inline-examples/README.md) adds optional preview framing, a responsive preview/source composition and a contextual action example. Other component pages retain their current presentation. Component palettes and sizes remain frozen.
