# Project Architecture

What actually exists in the codebase today, and how the redesign changes it. This is the technical companion to [CREATIVE_DIRECTION.md](CREATIVE_DIRECTION.md) and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — those documents describe *what it should look/feel like*; this one describes *how the code is organized to get there*.

## Current stack

```
astro          ^4.16.19   (static output, no SSR adapter, no integrations registered)
bootstrap      ^5.3.3     (selective SCSS imports only — see below)
gsap           ^3.15      (added Phase 4 — includes ScrollTrigger, no separate package)
sass           ^1.80      (devDependency)
```

No React, no other animation libraries. `tsconfig.json`'s dead `jsx: react-jsx` / `jsxImportSource: react` setting (there was no `@astrojs/react` integration and no React dependency, so it did nothing) has been **removed** — `tsconfig.json` now just extends `astro/tsconfigs/base`. If a future phase genuinely needs a React island, the integration and this config would need to be added back together, properly.

## Pages

- `src/pages/index.astro` — single-page site: `Layout` → `Header` → (`Hero`, `Projects`, `Skills`, `Experience`, `Contact`) → `Footer` + `Toast`. Owns the `IntersectionObserver` that drives the `.fu`/`.v` fade-up reveal system.
- `src/pages/proyectos/[slug].astro` — statically generated per-project case study page (`getStaticPaths` over `projects.ts`). Already structured close to the brief's case-study format: breadcrumb → hero header (title/client/year/lead) → screenshot stage (carousel if multiple screenshots) → two-column body (sidebar: client/year/stack/links/demo; body: Context → Problem/Solution split → Process → Result) → prev/next project nav.

## Components (`src/components/`)

One `.astro` file per section, each owning its own inline `<script>` for local interactivity (no shared state manager, no framework):

- `Header.astro` — `[S]` bracket logomark, language toggle, numbered nav links (`01`–`04`), an "available for projects" status pill, mobile burger/drawer. Scroll listener toggles `.is-scrolled` for the transparent→solid header transition; a second `IntersectionObserver` (added Phase 3) watches each nav-linked section and toggles a red `.active` state on whichever link's section currently crosses the vertical center of the viewport. **As of Phase 2, the theme-toggle button is gone**; **as of Phase 3, the old "Contratáme"/"Hire me" CTA button is gone too**, replaced by the availability pill per the brief's nav mockup.
- `Hero.astro` — **rebuilt in Phase 4** into the GSAP-pinned three-state timeline (Identity → Craft → Work) described in [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md). The markup always contains all three states in normal document flow (the reduced-motion/mobile/no-JS baseline); a `.hero--cinematic` class, added only when `(min-width: 992px)` and motion is allowed, is what turns them into pinned crossfading layers.
- `Projects.astro` — **Phase 5 attempted a cinematic rebuild (orchestrator + `ProjectFeatured`/`ProjectEntry` components); a visual review found real layout/presentation problems during scroll, so it was reverted.** Currently back to the original 2-column card grid (`proj-grid`, `.proj-card`) reading directly from `projects.ts`, exactly as it was before Phase 5. Rebuilding this remains the goal — see [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md)'s "Project storytelling" section for what's still believed correct and what needs more care next time.
- `Skills.astro` — typographic list + method tags, already close to the brief's "not a card grid" instruction.
- `Experience.astro` — two timelines (work history + `formacion`/education), already a timeline layout, not cards.
- `Contact.astro` — link list (email/LinkedIn/GitHub) + WhatsApp card with pre-filled, language-aware message.
- `Footer.astro`, `Toast.astro` — small, stable, no redesign work anticipated beyond token renames.

## Project data (`src/data/projects.ts`)

Single typed array, one object per project, already shaped for case-study storytelling:

```ts
{ slug, num, title, client, year, desc, desc_en,
  problem, problem_en, solution, solution_en,
  metric?, metric_en?,       // real, sparse — only Portal Municipal has one
  demo?: { label, label_en?, href?, pending? },
  context, context_en, process, process_en, result, result_en,
  tags, links, private?, full?,
  cover, screenshots }
```

All four real projects (Portal Municipal, Postas POS, EMOS, Estudio Jurídico) are present, correctly ordered, with real problem/solution/context/process/result copy in both languages and no fabricated content. **This data does not need new fields for the redesign** — the visual rebuild is a presentation-layer change on top of data that already supports it.

## Styling architecture (`src/styles/`)

```
abstracts/  _variables.scss   Bootstrap overrides + CSS custom properties (dark-only, semantic names)
            _mixins.scss      fade-up, spotlight (cursor-tracking radial gradient), card-base,
                               atmosphere (section stacking context), btn-primary/secondary
base/       _reset.scss       box-sizing reset, fixed ambient-glow + halftone background layers
            _animations.scss  the .fu/.v fade-up system + reduced-motion override
layout/     _header.scss      header, nav, lang toggle, mobile drawer
            _section.scss     .section spacing, comic-panel-gutter divider, .sec__eyebrow/__title,
                               panel-glitch keyframe (shared by every section heading)
components/ _hero.scss, _projects.scss, _skills.scss, _experience.scss, _contact.scss,
            _footer.scss, _toast.scss, _browser-mock.scss, _screenshot-carousel.scss
pages/      _project-page.scss
main.scss   import order: abstracts → selective Bootstrap → base → layout → components → pages
            (the Phase-1-era trailing `[data-theme="dark"]` toggle-visual block is gone)
```

**Phase 2 status**: the SCSS-variables-alias-CSS-custom-properties pattern (`$color-red: var(--color-red)`) is preserved exactly as it was (previously `$mint: var(--mint)`) — components consume the SCSS alias unchanged. What changed is the token *names* (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the full rename map) and the removal of theme branching: there is now exactly one `:root` block, no `[data-theme="dark"]` override block anywhere. The rename was applied file-by-file across every file in `src/styles/` (not just `_variables.scss`), since the old tokens (`$mint`, `--mint-rgb`, `$accent-2`, `--accent-2-rgb`, `$bg`, `$bg-2`, `$card`, `$text`, `$text-2`, `$text-3`, `$border`, etc.) were referenced directly throughout components, not only through a single indirection point.

**Bug found and fixed during (the otherwise-reverted) Phase 5 attempt** — kept, since it's unrelated to why Phase 5 was reverted: the Phase 2 rename script's `--card` → `--color-bg-soft` rule (intended for `var(--card)` CSS-custom-property references) also matched the unrelated BEM modifier selector `&--card` in `_browser-mock.scss`, silently renaming it to `&--color-bg-soft`. Since `Projects.astro` still referenced the class as `browser-mock--card`, that variant's compact styling never applied from Phase 2 onward — a real, if minor, visual regression that went unnoticed until this phase touched the same file. Fixed by restoring the selector name; a full-repo grep for the same corruption pattern (`&--color-*`) found no other instances.

**Already-implemented visual techniques** worth knowing exist before Phase 4 (don't rebuild from scratch):
- Ben-Day halftone + dual radial ambient glow, one fixed layer on `<body>` (`_reset.scss`).
- Comic-panel-gutter hairline divider between sections (`_section.scss`).
- `panel-glitch` chromatic keyframe, shared by every section title on reveal.
- RGB-ghost-plate portrait technique (`mix-blend-mode: screen`, twin tinted `::before/::after`) in `_hero.scss`.
- Cursor-tracking spotlight-card gradient (`@mixin spotlight`), driven by a single delegated `mousemove` listener in `Layout.astro`.

## i18n architecture — fixed in Phase 2

The duplication bug found during the audit is resolved. There is now exactly **one** copy of every translated string, in `src/i18n/translations.ts` (typed, `Lang`/`TKey` exported). `Layout.astro` imports it and injects it into the client via Astro's `define:vars` directive:

```astro
---
import T from "../i18n/translations";
---
<script define:vars={{ T }}>
  window.__T = T;
  function applyLang(lang) { /* unchanged DOM-swap logic */ }
  ...
</script>
```

`define:vars` serializes `T` server-side (`JSON.stringify`) into a `const T = {...}` statement ahead of the script, so the script itself no longer contains any hand-written copy — editing `translations.ts` is now the only way to change site copy, and it actually takes effect. The runtime mechanism is otherwise unchanged: `applyLang(lang)` still walks `data-i18n` (textContent), `data-i18n-html` (innerHTML, for `<br>`), `data-i18n-ph` (placeholders), and `data-es`/`data-en` / `data-es-html`/`data-en-html` (pre-rendered dynamic content) and swaps them client-side; language is still detected pre-paint (locale sniffing with a LatAm allowlist, `localStorage` persistence) in a separate `is:inline` script in `<head>` to avoid a flash of the wrong language. The theme half of that pre-paint script (dark/light detection) was removed along with the theme toggle.

While consolidating, three keys that existed only in the old inline copy (`proj_unit`, `proj_client`, `proj_year` — consumed by `Projects.astro` and `[slug].astro`) were added to `translations.ts`; a handful of accented-copy differences between the two old copies (e.g. "escribíme" vs "escribime", "Contratáme" vs "Contratame") were resolved in favor of whichever text was actually live on the site, so this change is copy-neutral — verified in-browser for both `es` and `en`, including persistence across page navigation.

Both Spanish and English still need to be designed for, not just translated — Spanish strings run measurably longer throughout `projects.ts` and `translations.ts`. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) typography section.

## Assets

- `public/images/fotito.webp` (portrait, 615KB) — becomes the large graphic object in the hero per [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md); needs sizing/optimization before it's animated at scale.
- `public/images/projects/{slug}/0N.{webp,png}` — 3 screenshots per project. Sizes are inconsistent (28KB–1.46MB) and formats are inconsistent (`postas-pos` is PNG, everything else is WebP). Optimization/format-normalization is a Phase 12 (performance) task, not a Phase 1 concern, but flagged here so it isn't lost.
- `public/SalvadorSanchezCV.pdf` / `_EN.pdf` — real CV files, swapped by the language toggle already.
- `docs/design/hero-storyboard.png` — the hero direction reference described in [CREATIVE_DIRECTION.md](CREATIVE_DIRECTION.md) and [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md).

## What we are preserving vs. replacing

**Preserving structurally** (data shape, routing, component boundaries):
- Astro page/component split and `getStaticPaths` project routing.
- `projects.ts` data shape and its actual content.
- `[slug].astro`'s case-study layout skeleton (sidebar + two-column body + carousel + prev/next).
- The `data-i18n`/`data-es`/`data-en` attribute-driven translation mechanism (fixing the source-of-truth bug, not the mechanism itself).
- The SCSS variable-alias-to-custom-property theming pattern.
- The single-fixed-layer background technique, halftone, section-divider, spotlight-card mixin.
- WhatsApp contact flow, CV download-by-language, toast component.

**Replacing visually**:
- `Hero.astro` — static layout → GSAP-pinned three-state timeline. **Done** (Phase 4), stabilized after a visual-review round found the transitions could leave content partially clipped.
- `Projects.astro` — card grid → cinematic per-project scroll sequence (featured + entries). **Attempted and reverted** (Phase 5) — visual review found real problems; back to the original card grid pending a rebuild.
- Color tokens — `$mint`/`--accent-2` naming → `--color-red`/`--color-blue`, dark-only. **Done** (Phase 2).
- Typography — Plus Jakarta Sans/JetBrains Mono → Barlow Condensed/Space Grotesk. **Done** (Phase 2).

**Removed outright** (Phase 2):
- Light theme (`:root` light tokens), the theme-toggle button/icons in `Header.astro`, the theme-detection/persistence script and `[data-theme="dark"]` CSS block.
- The dead `jsx: react-jsx` / `jsxImportSource: react` tsconfig settings.
- The i18n duplication (`translations.ts` is now the sole source, injected via `define:vars`).

**Not touched by this redesign**:
- Astro itself (no migration to Next.js — confirmed out of scope).
- Bootstrap's selective SCSS imports (grid/reboot/utilities) — no Tailwind introduced.
