# Design System

Concrete tokens and visual rules. **Status: Phase 2 implemented** — the tokens, dark-only palette, and typography below are live in `src/styles/abstracts/_variables.scss` as of this phase. Sections describing future component/animation work (custom cursor, card-to-case-study redesign, broader effect-token retrofit) are still forward-looking — marked explicitly where that's the case.

## Decision on record: dark-only (implemented)

The light theme ("Mumbattan") and the theme toggle have been removed entirely. `src/styles/abstracts/_variables.scss` now defines colors once, in a single `:root` block, with no `[data-theme]` branching anywhere in the codebase. The former dark palette ("Miles/2099") is now simply *the* palette.

Removed as part of this: the `#theme-toggle` button and its SVG icons (`Header.astro`), the theme-detection/persistence script and `portfolio-theme` localStorage key (`Layout.astro`), the `.header__theme*` CSS (`_header.scss`), and the `[data-theme="dark"]` override block (`main.scss`).

## Color tokens (implemented)

```
--color-bg:          #060914   // primary background
--color-bg-soft:      #0B1020   // secondary background (cards, raised surfaces) — also absorbs the
                                 // former $card and $bg-2 tokens, which pointed at the same value
--color-text:         #F4F4F5   // primary text
--color-text-rgb:     244, 244, 245
--color-muted:        #8B93A7   // secondary/meta text (former $text-2)
--color-muted-rgb:    139, 147, 167
--color-muted-dim:    rgba(139, 147, 167, 0.55)  // tertiary/lowest-emphasis text (former $text-3)
--color-red:          #FF1635   // primary accent — interaction, emphasis, active state
--color-red-rgb:      255, 22, 53
--color-red-dark:     #C9102A   // hover/pressed shade of red
--color-red-dim:      rgba(255, 22, 53, 0.12)   // low-opacity red fill (badges, hover backgrounds)
--color-blue:         #2634FF   // secondary accent — depth, RGB ghost, offset
--color-blue-rgb:     38, 52, 255
--color-border:       rgba(255, 255, 255, var(--border-opacity))
```

**Rename applied**: `$mint`/`--mint*` → `--color-red*`; `--accent-2*` → `--color-blue*`; `$bg`/`$bg-2`/`$card` → `--color-bg`/`--color-bg-soft` (consolidated — these three previously separate tokens all pointed at visually-equivalent surfaces); `$text`/`$text-2`/`$text-3` → `--color-text`/`--color-muted`/`--color-muted-dim`; `$border` → `--color-border`. The SCSS-alias-to-CSS-variable pattern (`$color-red: var(--color-red)`) is preserved, so components consume `$color-red` etc. exactly as they consumed `$mint` before — this was a name change, not a mechanism change. `$bg-3` was deleted outright (its only consumer was the removed theme-toggle track).

Two muted text tiers were kept (`--color-muted` / `--color-muted-dim`) rather than collapsed into one, because the codebase used both meaningfully (e.g. "private repository" labels, footer text) and collapsing them would have been a visual change, not just a rename — out of scope for this phase.

No new colors were introduced. Red and blue remain the entire interaction vocabulary, exactly as specified in the brief.

## Typography (implemented)

- **Display: Barlow Condensed** (`$font-display`) — applied to the hero headline (`.hero__title`), every section heading (`.sec__title`, shared across Projects/Skills/Experience/Contact), project card titles (`.proj-card__title`), the project case-study page title (`.proj-page__title`), and the (currently unreachable) placeholder-number style (`.proj-card__placeholder-num`).
- **Body/UI: Space Grotesk** (`$font-body`) — the site-wide default (`body { font-family: $font-body; }`), so navigation, paragraphs, labels, buttons, and technical/tag text all pick it up without individual overrides. This also replaced the old `$font-mono` (JetBrains Mono) usage in the Stack section's tech-name/method-tag styling.
- Loaded via the existing Google Fonts `<link>` in `Layout.astro` — no new dependency. Replaces the previous Plus Jakarta Sans / JetBrains Mono pairing entirely.

**Not done in this phase**: font *sizes* were deliberately left untouched (only `font-family` was added to each target rule) — per the phase's own instruction not to visually redesign layouts yet. Expect size/scale tuning once condensed-type rhythm is designed properly in Phase 4 (Hero) and beyond.

**Bilingual constraint** (unchanged guidance): Spanish strings run measurably longer than English (see `src/data/projects.ts`, `src/i18n/translations.ts`). Any future layout work on display type must be checked against the Spanish string first.

## Spacing tokens (partially implemented)

```
$space-page-x:     clamp(1.5rem, 5vw, 5rem)     // page horizontal gutter
$space-section-y:  clamp(3.5rem, 7vw, 5.5rem)   // vertical rhythm between sections
$gap-xs / sm / md / lg:  6px / 12px / 20px / 32px
```

`$space-page-x` and `$space-section-y` are wired into their real, previously-duplicated usage sites (`_header.scss`'s header and mobile-nav padding, `_section.scss`'s `.section` padding) — this removed literal duplication with zero visual change. `$gap-*` are defined and available but **not yet retrofitted** into individual component gaps (hero actions, project grid, etc.) — those remain component-local literals for now, to avoid unreviewed layout drift in a foundational phase. Adopt them incrementally as those components are touched in later phases.

## Effect tokens (partially implemented)

```
--border-opacity:     0.08    // drives --color-border directly
--glow-red-opacity:   0.3
--glow-blue-opacity:  0.22
--halftone-opacity:   0.07
--rgb-offset:         5px
```

Wired in at exact-value-match sites only (so nothing visually changed): `--color-border`'s alpha channel, the halftone dot layer's opacity (`_reset.scss`), the hero portrait's red/blue drop-shadow glow (`_hero.scss`), and the hero ghost-plate RGB offset (`_hero.scss`'s `::before`/`::after` base transform and the `hero-ghost-a`/`hero-ghost-b` keyframes' rest state — the intensified hover/mid-keyframe values were left as local literals since they're deliberately *not* the default). `$ease-out`, `$duration-fast/base/slow` were added alongside these but are not yet applied anywhere beyond their existing `$ease-out` call sites — reserved for the GSAP work in later phases.

The many other one-off opacity/shadow values scattered through the components (badge glows, tag backgrounds, hover shadows, etc.) were **intentionally left as local literals** rather than force-fit into these shared tokens — doing so would have changed their actual rendered values (they were never all the same number to begin with) and risked exactly the kind of unreviewed visual drift this phase was told to avoid. Broader consolidation is a candidate for a later phase, once the animation/visual work gives a real reason to tune them together.

## Borders & surfaces

Unchanged in behavior, renamed in token: `--color-border` (rgba white, opacity now driven by `--border-opacity`), raised surfaces on `--color-bg-soft` against `--color-bg`.

## Background system

Unchanged in behavior: the single fixed `body::before`/`::after` ambient-glow + halftone layers in `_reset.scss`, now reading the renamed red/blue tokens and the `--halftone-opacity` token.

## RGB / chromatic effects

Unchanged in behavior (rename only): `hero-glitch`/`panel-glitch` keyframes, the RGB-ghost portrait technique, halftone-as-texture-only. See [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md) for how these get promoted to GSAP-driven choreography in later phases.

## Component visual language — not yet implemented

The card-grid-to-case-study redesign, the custom cursor, and any new component visual treatments described in [CREATIVE_DIRECTION.md](CREATIVE_DIRECTION.md) are **not part of Phase 2**. Phase 2 only touched tokens, typography, dark-only cleanup, and technical foundations (i18n, dead config). Buttons, cards, badges, etc. render with the same structure as before, just repainted through the renamed tokens.

## Responsive visual rules

Unchanged from Phase 1 planning — no responsive behavior was modified this phase. Verified after implementation: no horizontal overflow at 375px width, mobile nav (burger) and desktop nav correctly toggle via the existing breakpoint mixins, no regressions observed.
