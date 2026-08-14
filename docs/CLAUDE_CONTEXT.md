# Claude Context

Operational summary for anyone (human or Claude) picking up work on this redesign without having read the full conversation history. Read this first; go to [CREATIVE_DIRECTION.md](CREATIVE_DIRECTION.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md), or [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) for depth on any point.

## What this portfolio is trying to achieve

Salvador Sanchez, a frontend developer in Río Cuarto, Córdoba, Argentina, needs a portfolio that *is itself* the proof of his frontend skill — an experimental, editorial, cinematic site (Nothin'-inspired composition + Spider-Verse-inspired red/blue chromatic energy) built around **four real projects**, minimal invented content, and a hard requirement that it still reads as hireable, not just impressive. Full brief lives in the originating conversation; this doc + the four others are the durable, re-readable version of it.

## The most important design decisions (already made — do not re-litigate without asking)

1. **Dark-only — implemented in Phase 2.** The light theme ("Mumbattan") and the theme toggle are gone. One palette: `#060914` bg / `#0B1020` bg-soft / `#F4F4F5` text / `#8B93A7` muted / `#FF1635` red / `#2634FF` blue, as `--color-*` custom properties in `src/styles/abstracts/_variables.scss`.
2. **No migration to Next.js.** Astro stays. This was an explicit brief constraint, not a default.
3. **No Tailwind.** Bootstrap's selective SCSS imports stay; no new CSS framework.
4. **GSAP + ScrollTrigger is the only new dependency** this redesign introduces. No React, no Framer Motion, no Three.js/WebGL unless a specific later requirement genuinely justifies it (none has yet).
5. **This is a continuation, not a rebuild from zero.** The current codebase already implements halftone background, RGB-ghost photo, chromatic glitch keyframes, and comic-panel section dividers. The redesign extends these into GSAP-driven scroll choreography — it does not throw them out and start over.
6. **No LAB/EXPERIMENTS section** in this release. Don't invent placeholder experiments to fill it.
7. **No fabricated content, ever.** Four real projects, real metrics only where they exist (currently just Portal Municipal's `+9,000 weekly users`), no invented clients, no invented professional history.
8. **Navbar CTA removed — Phase 3.** The old "Contratáme"/"Hire me" button is gone, replaced by the brief's "available for projects" status pill (matches the storyboard's nav mockup, which has no CTA button). Conversion now happens through the Contact section and the nav's own "Contact" link, not a persistent header button. Flagged for your review in case you'd rather it stayed.
9. **Phase 5 (Selected Work) was attempted and reverted.** A cinematic rebuild of `Projects.astro` (featured Portal Municipal + lighter entries for the other three) was built, but a visual review found real layout/presentation problems during scroll that build checks and computed-style verification hadn't caught. Per user instruction, it was fully reverted rather than patched — `Projects.astro` is back to the original card grid. The design *intent* (Portal Municipal as proof-of-concept, consistent visual language across projects without identical choreography) is still believed correct; see [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md) for what's still open before attempting the rebuild.
10. **Governing rule, added after the Phase 5 revert: "If an animation makes the content less usable, the animation is wrong."** Every scroll-driven state needs a real stable zone — wide enough that a user stopping anywhere in it sees fully-resolved, legible content — with transitions kept short and clearly the minority of the scroll range. This produced the Hero's current stable-zone timeline structure (three ~25%-wide stable holds, two ~12%-wide transitions) and must inform any future Selected Work rebuild from the start.

## Current technical decisions

- Stack: Astro 4.16 (static), Bootstrap 5.3 (selective imports), SCSS, vanilla JS, GSAP 3.15 + ScrollTrigger (installed Phase 4; currently used only in `Hero.astro` — the Phase 5 attempt that would have made `Projects.astro` a second consumer was reverted).
- No shared animation utilities exist right now. `rgbGlitchBurst()` was briefly extracted to `src/scripts/rgb-glitch.ts` during the Phase 5 attempt and moved back into `Hero.astro` when that was reverted — don't re-extract it (or build any other shared animation utility) until a second real consumer actually exists again, not just "for consistency" ahead of time.
- One `.astro` component per section, each with its own local `<script>` — no shared framework state, no global store.
- Theming via SCSS variables aliasing CSS custom properties (`$color-red: var(--color-red)`, renamed from `$mint: var(--mint)` in Phase 2) — single dark `:root` block, no `[data-theme]` branching anywhere.
- i18n via `data-i18n`/`data-es`/`data-en` DOM attributes swapped at runtime by `Layout.astro`'s inline script. **Fixed in Phase 2**: `src/i18n/translations.ts` is now the sole source of truth, injected into the client script via Astro's `define:vars` — there is no more duplicate copy to drift.
- `tsconfig.json`'s dead `jsx: react-jsx` config has been **removed** (Phase 2) — it now just extends `astro/tsconfigs/base`. Re-add only alongside an actual `@astrojs/react` integration if a future phase genuinely needs a React island.

## Current project order (fixed, do not reorder without being told)

```
01  Portal Municipal          — Municipalidad de Río Cuarto     (strongest case study, leads)
02  Postas · Sistema POS      — private client                  (product/UI thinking)
03  EMOS · Sitio Institucional — Río Cuarto municipal company    (institutional/web experience)
04  Estudio Jurídico Agustín Sánchez — law firm                  (commercial landing-page work)
```

## Things Claude must never do on this project

- Never invent clients, metrics, testimonials, or professional history not already present in `src/data/projects.ts` / the CV.
- Never introduce Tailwind, or migrate the app off Astro.
- Never add large numbers of animation/UI libraries "because they exist" — every new dependency needs a specific, named justification (see [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) for the one approved addition: GSAP).
- Never use literal Spider-Man/Marvel imagery, logos, characters, or comic panels — the visual language is inspired by, not copied from, that source.
- Never design or ship a change assuming English-only text length — Spanish is measurably longer and must be checked.
- Never ship a scroll-pinned/scrubbed animation without also building its `prefers-reduced-motion` fallback in the same pass.
- Never start large-scale implementation of a new phase without the phase before it being approved — this project moves in explicit, user-gated phases (see below).
- Never silently reintroduce the light theme or theme toggle — removed in Phase 2, stays removed.
- Never hand-duplicate translation copy into `Layout.astro` again — `src/i18n/translations.ts` is the only place copy is written; the client script receives it via `define:vars`.
- Never treat a clean `npm run build` plus computed-style/DOM checks as proof that a scroll animation actually looks right — this environment's browser pane can't render live scroll (no `requestAnimationFrame`/`IntersectionObserver`), so those checks can only catch structural bugs, not visual ones. Say so plainly when reporting, and expect a real visual review to sometimes fail anyway (it did, for Phase 5).
- Never patch over a scroll-driven layout that a visual review found broken — revert to the last known-good state first (ask if unclear what that is), then rebuild deliberately. This is what happened with the Phase 5 Projects rebuild.

## Things Claude should prioritize

1. Clarity and the "5-second recruiter test" over spectacle, every time they conflict.
2. Reusing existing primitives (halftone, ghost-plate photo, panel-glitch, spotlight mixin, case-study page skeleton) over rebuilding from scratch.
3. Image optimization awareness — several project screenshots and the hero portrait are unoptimized (up to 1.46MB); don't animate large unoptimized images without flagging or fixing size first.
4. One coherent visual system — every effect (RGB split, glitch, halftone, parallax) has a defined *reason* it's used where it's used, per [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md)'s "what must not be overused" section.
5. When adding a new one-off color/opacity/spacing value, check `_variables.scss` first — reuse or extend the token set there rather than hardcoding a literal, so [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) stays the actual source of truth.

## Implementation phases (status: Phase 4 stabilized; Phase 5 attempted, reverted, awaiting rebuild)

```
0.  Audit current project                                       ✅ done
1.  Documentation (this file + 4 others)                        ✅ done
2.  Design system: strip light theme, rename tokens, swap type  ✅ done
3.  Navbar                                                       ✅ done
4.  Hero — GSAP-pinned three-state timeline                     ✅ done (stabilized: stable-zone timeline structure)
5.  Selected Work                                                ⏳ reverted after visual review; not approved, do not restart without being asked
6.  Project transitions                                          ⏳ blocked on Phase 5
7.  Stack
8.  Experience
9.  Contact
10. Responsive / mobile
11. Accessibility
12. Performance (image optimization, format normalization)
13. SEO
14. Final visual polish
```

Each phase is implemented and reviewed before the next begins — this has been the explicit working agreement for this project from the start. Do not batch multiple phases into one unreviewed change.
