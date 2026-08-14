# Animation System

How motion is built, and the rules that keep it from taking over. **Status: Hero implemented (Phase 4), stabilized after a visual review round.** GSAP is installed (`gsap` package, includes `ScrollTrigger`). Project-storytelling scroll sequences and the custom cursor described below are still specification, not yet built — Phase 5 was attempted, found broken on visual review, and **reverted** (see "Project storytelling" below); Selected Work will be rebuilt from this document's spec once the Hero's revised approach has been visually approved.

## The governing rule (added after the Phase 5 revert)

**If an animation makes the content less usable, the animation is wrong.** Concretely: every scroll-driven state must have a genuine *stable zone* — a wide range of scroll progress where the timeline can sit at any point and still show fully-resolved, legible content. Transitions between states must be short relative to those stable zones, never the majority of the scroll range. A user who stops scrolling at an arbitrary point should land in a settled state far more often than not. See "Hero: stable-zone structure" below for the concrete pattern this produced.

## Technology

- **GSAP + ScrollTrigger** for anything scroll-scrubbed or pinned. The only new runtime dependency the redesign introduces (see [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)). Imported as an ES module directly in `Hero.astro`'s `<script>` (`import { gsap } from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";`) — no global/CDN script, no shared animation-utility module. One was briefly extracted to `src/scripts/rgb-glitch.ts` during the (reverted) Phase 5 attempt; since Projects no longer uses it, `rgbGlitchBurst()` moved back to living entirely inside `Hero.astro` — don't re-extract it until a second real consumer exists again.
- **Vanilla JS / CSS** for everything else — the existing `IntersectionObserver`-driven `.fu`/`.v` fade-up system (in `src/pages/index.astro` + `src/styles/base/_animations.scss`) stays as the mechanism for simple reveal-on-view content (Stack, Experience, Contact) and as the baseline the Hero itself renders as before GSAP ever runs.
- No React, no Framer Motion, no Lottie.

## Hero: three-state scroll story (implemented, stable-zone structure)

Built in `src/components/Hero.astro` + `src/styles/components/_hero.scss`. Matches `/docs/design/hero-storyboard.png` in *direction*, not pixel-for-pixel — and reframed slightly from the original state names into the brief's IDENTITY / CRAFT / WORK framing (same three-beat shape, different labels).

**Architecture**: the HTML always contains all three state blocks (`.hero__block--identity`, `--craft`, `--summary`) plus the persistent photo, stacked in normal document flow — this is the actual rendered page for mobile, reduced-motion, and no-JS. A script gated on `(min-width: 992px)` **and** `(prefers-reduced-motion: no-preference)` adds a `.hero--cinematic` class and builds the GSAP timeline; that class is the only thing that switches the three blocks from normal flow into absolutely-positioned layers crossfading in the same box. `matchMedia` `change` listeners rebuild or tear down the timeline (`ScrollTrigger.kill()` + `gsap.set(..., { clearProps: "all" })`) if the viewport crosses the breakpoint or the OS motion preference changes mid-session — no page reload needed either direction.

- Pin: `ScrollTrigger` on the `.hero` element itself, `start: "top top"`, `end: "+=140%"`, `scrub: 0.4`. Deliberately short — about 1.4 viewport-heights of scroll distance total — so the pin resolves quickly and never reads as scroll-jail; `scrub: 0.4` keeps the response close to immediate without the jitter of `scrub: true`.

**Stable-zone structure** (revised after visual review found the first pass — roughly equal-sized transition and stable zones — left the timeline in a partially-clipped, "broken-looking" state whenever a user stopped scrolling mid-transition): five GSAP labels divide the timeline into three wide stable holds and two short transitions, sized so stable zones dominate the scroll range:

```
0 ────── .26 ── .38 ────── .64 ── .76 ────── 1
|  IDENTITY  |trans.|  CRAFT   |trans.|  WORK  |
   (stable)   (12%)  (stable)   (12%)  (stable)
```

- **Identity stable** (`identityStable` label, 0 → .26, ~26% of the pin): badge, the existing large headline (`hero_title`, "RIGHT."/"lo esperás." in red), primary/secondary CTAs, scroll cue. Fully visible at rest — nothing fades in on load, this is the default HTML state. The timeline can sit anywhere in this range with no visible change.
- **Identity → Craft transition** (`toCraft` label, .26 → .38, 12%): identity exits (fade + slight rise), photo shifts position/scale/rotation, craft enters via the reveal (not fade — see below), with a glitch burst at the same instant. By label `craftStable` (.38) the reveal is **fully resolved** — clip-path fully open — not still animating.
- **Craft stable** (.38 → .64, ~26%): one large editorial statement (`hero_desc`, repositioned here rather than living under the headline as before) in Barlow Condensed at display size — "how I build," not a wall of text. Fully settled for over a quarter of the total scroll range.
- **Craft → Work transition** (`toWork` label, .64 → .76, 12%): craft exits the same way it entered (reveal in reverse), photo shifts again, summary block enters with a smaller-magnitude version of the same reveal. Fully resolved by label `workStable` (.76).
- **Work stable** (.76 → 1, ~24%): identity-card layout — stacked name, role (reuses `exp_role_1` rather than a new key), a `/`-separated tech list (React / Next.js / Astro / SCSS), location (reuses `footer_location`), and the same availability badge as State 01 (reused, not a near-duplicate style) — then a "next section" cue (reuses `proj_eyebrow`) fades in, holding fully settled until the pin releases into Projects.

Within each transition, outgoing and incoming content overlap (e.g. identity is still fading while craft is already revealing) specifically so there's no beat where nothing is visible — a user pausing mid-transition sees *something* changing, not a blank gap, even though that specific ~12%-wide slice isn't a "stable" read the way the three main zones are.

**Craft/Work reveal mechanism** (revised after initial Phase 4 review — the first pass used a plain opacity crossfade for these two transitions, which read as "just a fade"; this is the fix): movement and a `clip-path` wipe carry the transition, with opacity demoted to a fast supporting role rather than the primary effect.

- The clip-path targets the actual content box (`.hero__statement` for Craft; a new `.hero__id-inner` wrapper added around the Work card's contents) rather than the oversized `position: absolute; inset: 0` block that hosts it — clipping the block itself would sweep through the empty vertical space reserved for crossfade layering before ever touching the (vertically centered) text.
- **Entrance**: `clip-path: inset(100% 0% 0% 0%)` (fully clipped, mask sitting as a zero-height sliver at the bottom of the text box) animates to `inset(0% 0% 0% 0%)`, so the visible region grows upward from the bottom — text reads as uncovered from below. Runs concurrently with a `y: 26px → 0` rise, both completing exactly at the transition's end label (e.g. `craftStable`) so the stable zone always starts fully resolved, never mid-animation. The containing block's `autoAlpha` flips 0→1 first, over a much shorter duration, so it clears the way early rather than doing the perceptual work. An RGB registration-glitch burst (see below) fires at the same instant the wipe starts, so it reads as part of one event instead of a separate decoration.
- **Exit**: the inverse — `clip-path` animates to `inset(0% 0% 100% 0%)` (the visible region collapses from the bottom up) while the text continues rising (`y: 0 → -22px`), so it reads as retracted upward rather than dissolved. `autoAlpha` fades out late, trailing the motion instead of leading it.
- Work's entrance reuses the identical mechanism at a smaller magnitude (`y: 22px`, not 26px) — intentional, since the identity card is five lines of content and a larger travel distance read as busy. It gets its own glitch burst too.
- `teardownCinematicHero()` clears props on `.hero__statement` and `.hero__id-inner` and removes any `.glitch-layer` clones that might be mid-flight — without this, switching from cinematic back to baseline mid-session (crossing the 992px breakpoint, or the OS motion preference changing) could leave a stale inline `clip-path` hiding the text, or an orphaned glitch clone, in the static fallback.

**RGB registration-glitch burst** (`rgbGlitchBurst()` in `Hero.astro`, revised after a second Phase 4 review round — the first pass reused the site's existing `panel-glitch` CSS keyframe via a `.glitch-in` class, which read as too subtle/generic; this replaces it with a real chromatic-split effect): fires once at the start of the Craft and Work entrances, synchronized with the reveal wipe. Not a permanent effect, not looped, not present anywhere else on the page.

- Clones the target text node (`.hero__statement` for Craft, `.hero__id-name` for Work) four times: two tinted red, two tinted blue (`color` + `mix-blend-mode: screen`, the same blend mode the hero photo's ghost plates already use), each clipped via CSS `clip-path` to its own top or bottom half so the split reads as **displaced print strips**, not one solid colored silhouette — this is the "slice/fragmentation" texture, done with plain CSS clipping rather than a hand-tuned polygon.
- Clones are appended to `.hero__text` (positioned via a one-time `getBoundingClientRect()` snapshot), **not** as descendants of the target itself — the target is mid-reveal under its own `clip-path` at the exact moment the glitch fires, and a clipped element's descendants can't escape that clip in CSS. Appending to the unclipped root and rect-matching the position sidesteps that entirely.
- Runs as its own `gsap.timeline()` — a plain, non-scrubbed timeline played once in real time (0.18s total: a 0.05s stepped snap-out on `ease: "steps(2)"`, matching the choppy, discontinuous feel of a misprinted frame, then a 0.13s clean `power3.out` recomposition back to `x:0, y:0`) — so the flash always reads at the same fast, fixed speed regardless of how fast or slow the user is scrolling through the scrubbed reveal itself. Same "fire a fixed-duration accent from inside a scrubbed timeline" pattern the old CSS-keyframe trigger already used; only the visual mechanism changed, not the architecture.
- Clones self-remove (`onComplete`) once the burst finishes, so nothing lingers in the DOM. All are `aria-hidden="true"` and stripped of `id`/`data-i18n*`/`data-es`/`data-en` attributes before insertion, so they're inert to both the i18n swap script and screen readers.

The photo (`.hero__photo`) is one persistent element throughout — GSAP tweens its `x`/`y`/`scale`/`rotate` directly; the RGB ghost plates stay exactly as they were (`::before`/`::after`, `mix-blend-mode: screen`), moving with their parent for free. Their own infinite CSS drift (`hero-ghost-a`/`-b`) only runs in the baseline (non-cinematic) case — the two mechanisms never target the same property at the same time, so there's nothing to fight over. None of this touched the pin's `end`/`scrub` values, the Identity block's own exit animation, or the mobile/reduced-motion gating logic — all unchanged from the original Phase 4 build.

## Testing note

This environment's browser preview pane does not composite frames when not actively displayed, which means neither `requestAnimationFrame` nor `IntersectionObserver` callbacks fire in it — confirmed directly (a bare `requestAnimationFrame` call and a fresh `IntersectionObserver` both silently never fired). Since GSAP's scrub ticker depends on `requestAnimationFrame`, the live crossfade-through-scroll could not be visually exercised end-to-end in that pane, though the pin mechanism itself was confirmed working (`position: fixed` correctly applied on scroll, `ScrollTrigger`'s `pin-spacer` correctly inserted, initial timeline state correctly applied). A real visual scroll-through should be spot-checked outside that constrained environment before calling the Hero fully signed off.

## Project storytelling (spec only — Phase 5 attempted and reverted)

A first Phase 5 build existed briefly: `Projects.astro` rebuilt as an orchestrator, plus new `ProjectFeatured.astro` (Portal Municipal, pinned two-beat) and `ProjectEntry.astro` (the other three, lighter non-pinned reveal) components. A visual review found real layout/presentation problems during scroll that weren't caught by build checks or computed-style verification, and — following the same "an animation that breaks usability is wrong" principle above — the whole thing was **reverted**: `Projects.astro` is back to the original card grid (`proj-grid`, `.proj-card`), `ProjectFeatured.astro`/`ProjectEntry.astro` and the extracted `src/scripts/rgb-glitch.ts` were deleted, and `_projects.scss`/`_browser-mock.scss` are back to their Phase 2 (token-rename-only) state.

**What's still believed correct and will inform the rebuild**: the original design intent (large screenshot → THE PROBLEM → THE APPROACH → THE RESULT → TECH → view-project link, Portal Municipal as the proof-of-concept before the pattern rolls out, consistency of visual language rather than identical choreography across all four projects) is unchanged as *direction*. What's now known to need more care before rebuilding: whichever combination of stacked `ScrollTrigger` pins, async-loading screenshot images without reserved dimensions, and/or CSS techniques (e.g. the `direction: rtl` column-swap trick tried for alternating layout) caused the visual break needs to be identified with actual eyes on the running site, not just build/computed-style checks, before the next attempt — and that next attempt should apply the same stable-zone-dominant timeline structure the Hero now uses, from the start, rather than arriving at it after a visual-review round.

Transition between project N and N+1 (as opposed to each project's own entrance) is still open design territory — Phase 6's explicit scope, not Phase 5's.

## Transitions in general

Prefer `transform` and `opacity` for anything animated. `clip-path` is acceptable for reveals/transitions specifically (not for continuous animation). Avoid animating properties that trigger layout (`width`, `height`, `top`/`left` on non-transformed elements) or expensive repeated filters (blurred elements re-filtering every scroll frame).

## Custom cursor

Desktop only (gate on `hover: hover` and pointer capability — the existing spotlight-card code in `Layout.astro` already does exactly this check and can be reused as the pattern). Small red marker by default; smoothly interpolated (lerp/`quickTo`, not 1:1 tracking) so it never visibly lags or chases; expands to short text labels on specific targets:

- Project links/screenshots → `VIEW PROJECT ↗`
- Interactive images → `EXPLORE ↗`

Disabled on touch devices and under `prefers-reduced-motion`.

## Reduced motion

`prefers-reduced-motion: reduce` disables all pinning/scrubbing:

- Hero renders its State 3 content directly (or a static equivalent), no pin.
- Project sections render as a normal scrolling flow with the existing `.fu` fade-up, no pin.
- Parallax and continuous/looping effects (ghost-plate drift, badge blink) are removed, matching how `src/styles/base/_animations.scss` already special-cases `.fu` under this media query.
- All content stays reachable and in the same reading order — reduced motion changes *how* things appear, never *what* is available.

This isn't just an accessibility nicety layered on afterward — every timeline should be designed with its reduced-motion fallback in mind from the start, since the fallback is also what non-cinematic (mobile) treatment reuses.

## Mobile animation strategy

- No pinning by default on mobile — scroll-jacking on a small viewport with browser chrome that resizes on scroll is a reliability risk, not just a taste call.
- Shorter, non-scrubbed reveal animations (the existing fade-up system) replace the desktop pin/scrub choreography.
- No custom cursor.
- Touch-friendly interaction targets; carousel/gallery controls (already implemented for project screenshots in `[slug].astro`) stay tap-driven.
- If a specific mobile hero treatment is worth a lighter pinned sequence, that's a Phase 10 design decision made with actual devices in hand — not assumed now.

## Performance rules

- Every `ScrollTrigger` instance gets scoped and killed/refreshed appropriately on navigation — no orphaned instances accumulating across the SPA-less, statically-routed Astro pages (each page load is a fresh document, which actually simplifies this).
- Prefer one timeline per pinned section over many small independent triggers competing for scroll.
- Images used as animated objects (hero portrait, project screenshots) must be sized/optimized before they're animated — animating a 1.4MB unoptimized image (see the `estudio-juridico/01.webp` performance risk in [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)) is not acceptable regardless of how the transform is written.
- No continuously-running animation loops outside of what's already cheap (the badge blink, the header hairline gradient) — anything scroll-independent and infinite is a battery/CPU cost with no corresponding payoff.

## What must not be overused

- Glitch: emphasis only, never ambient/looping on static content.
- Parallax: depth cue on hero/project imagery, not applied to every element that happens to move.
- RGB split: identity marker on graphic objects (photos, screenshots), not a filter slapped on body text.
- Spring/bounce easing: not part of this system's motion language at all — motion here is smooth, controlled, cinematic, "slightly physical," never bouncy or floaty.
- Fade-in-everything: reserved for the simple sections (Stack, Experience, Contact); the cinematic sections earn scroll-driven motion because they're telling a story, not because motion is the default state of every element on the page.
