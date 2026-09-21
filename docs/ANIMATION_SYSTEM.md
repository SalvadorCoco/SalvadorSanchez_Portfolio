# Animation System

How motion is built, and the rules that keep it from taking over. **Status: Hero implemented (Phase 4), stabilized after a visual review round. Projects rebuilt a third time (Phase 5, take three) — minimal, image-forward, deliberately without GSAP.** GSAP is installed (`gsap` package, includes `ScrollTrigger`) and used only by `Hero.astro`; Projects uses none of it. The custom cursor described below is still specification, not yet built.

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

## Project storytelling (implemented, third attempt — minimal, image-forward, GSAP-free)

The first Phase 5 build (`ProjectFeatured.astro`/`ProjectEntry.astro`, stacked `ScrollTrigger` pins, a `direction: rtl` column-swap trick) broke visually and was reverted. The second attempt (sticky screenshot + per-beat problem/approach/result reveal) was rejected on visual review too: "literal es todo el texto a la vista y la foto ni se ve... quería algo mas cinematografico... da una re paja leer tanto texto de una" — all the text visible at once, the photo barely showing, a drag to read. The explicit direction that followed was to stop guessing and look at how real editorial sites do this — Nothin' by name.

**Research**: fetched `noth.in` directly and searched for how comparable editorial/agency portfolios present project listings. The pattern held everywhere: the listing shows title + one short line + a large image + a CTA — no metadata, no multi-paragraph breakdown, no visible problem/process/result structure. That structure isn't *dropped*, it just doesn't live on the listing — it's what the project's own detail page is for.

**Third take starts from that**: the full problem/context/process/result narrative stays exactly where it already lived — `/proyectos/:slug` — untouched. The homepage listing's job changes from "tell the story" to "be a confident, image-forward teaser that makes someone click through." No GSAP, no ScrollTrigger, no pin, no sticky — one file, `Projects.astro` + `_projects.scss`, no new components.

- **Two featured entries** (Portal Municipal, Postas — the two strongest stories, per direct instruction): number + title + client/year (`__head`) → one large full-width screenshot (`__shot`) → one editorial description line + metric (where one exists) + tags + links, ending in "Ver caso completo →" (`__foot`). That's the entire structure — no problem/approach/result beats on the listing itself.
- Each entry is an `<article>`, not one giant `<a>` — a tall element is a bad link target (breaks text selection, surprising click behavior). Three explicit link points instead: the screenshot, the title, and the CTA, all pointing at the same `/proyectos/:slug`.
- **Screenshot as the centerpiece**: full width, large, revealed with the exact same `.fu`/`.v` opacity+transform fade every other reveal on the site uses — no custom clip-path timeline. A first version tried a slower (0.9s) `clip-path` wipe gated on the same `.v` toggle; on a real device it was easy to scroll past the shot faster than that transition could finish, which read as "the screenshot never shows up" (found via user report, not caught in this environment's own testing — see the verification note below). Reverted to the plain, fast (0.35s), already-proven fade, which can't lag behind a normal scroll the same way.
- **Screenshot identity**: carries the Hero photo's exact red/blue glow (`filter: drop-shadow(...)` using the same `--glow-red-opacity`/`--glow-blue-opacity` tokens) — ties it to the site's established visual signature without touching a single pixel of the actual UI being shown.
- **Entrance**: the sitewide `.fu`/`.v` fade-up (`IntersectionObserver`, already global, zero new JS), applied to `__head`/`__shot`/`__foot` as three independent blocks per entry — no per-beat granularity needed anymore since there are no beats.
- **Two leaner entries** (EMOS, Estudio Jurídico) below a "more projects" divider — unchanged from the previous take: screenshot, title, client, one-line description, tags, link, single `<a>` each.
- **No layout shift**: screenshot space is reserved via `aspect-ratio: 16/10` on the existing `browser-mock--feature`/`--mini` variants — untouched from the previous take, still scoped away from the `browser-mock--cover` variant `/proyectos/:slug` depends on.
- `.proj-card` survives as a shared class on both the `<article>` and the mini `<a>`s purely so the two hover rules in `pages/_project-page.scss` (`.proj-card:hover .proj-card__arrow` / `.plink--see-more`) keep working — the featured markup no longer renders a `.proj-card__arrow` element at all (that affordance stays on the leaner `.proj-mini` entries only), which is harmless since CSS rules with no matching element simply do nothing.

**Real bug found on user report, after this environment's own checks missed it**: the first version of this take used a custom `clip-path` wipe (0.9s) on `__shot`, gated behind the same `.fu`/`.v` toggle. In this environment's browser pane the cascade for that rule checked out correctly (confirmed by forcibly toggling `.v` and comparing with `transition: none` — the target `clip-path` value was right), which is exactly why it passed every check available here. On a real device, though, the screenshot and the text below it (`__foot`) simply never appeared while scrolling normally. The actual failure mode: a 0.9s transition on a very tall (regularly 700px+) element, triggered only once `IntersectionObserver` crosses a 10% visibility threshold, is easy to out-scroll at ordinary reading speed — the element becomes "revealed" but the animation never gets a chance to finish before it's out of view, so it just reads as permanently blank. Fixed by dropping the custom clip-path timeline entirely and reverting `__shot` to the exact same plain, fast (0.35s) `.fu`/`.v` opacity+transform fade every other reveal on the site already uses — that mechanism has no equivalent failure mode since it's short enough to always resolve well within normal scroll speed.

**Honest verification note**: build is clean; structural/computed-style checks passed — correct markup (no problem/process/result text leaking into the listing, confirmed via rendered page text), image requests resolving 200, no horizontal overflow at 375px or 1280px, ES/EN toggle correctly swapping the new `__desc`/`__metric` text, `[slug]` pages independently re-verified with no console errors. What's *still not verified*: the actual visual composition once the (now-simplified) reveal plays on a real device — this environment's browser pane doesn't composite frames when not actively displayed, so `IntersectionObserver`/CSS-transition behavior couldn't be fully exercised here even after the fix above, which is exactly the class of bug that slipped through the first time. A real look on an actual device/browser is still the only thing that can close this out.

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
