# Creative Direction

Source of truth for *why* the redesign looks and feels the way it does. If an implementation decision isn't obviously covered by [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) or [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md), it should be resolvable by reasoning from this document.

## The one-line concept

**Minimal in content. Experimental in execution. Real in substance.**

The portfolio is itself the strongest evidence of Salvador's frontend ability. Every visual decision has to double as a demonstration of craft — not decoration on top of a resume, but the resume's actual argument.

## What the visitor should understand, in order

1. Who Salvador is (name, role, location).
2. What he does (frontend developer, React/Next.js/Astro).
3. What real projects he's built (four, all real, all named).
4. What technologies he uses.
5. How to reach him.

If a visual choice makes any of these five slower to find, the choice loses — no exceptions for how good it looks in isolation.

## Two references, one voice — not two aesthetics bolted together

**Nothin' (noth.in)** supplies the *editorial* half: large-scale typography as structure, negative space as a design element (not empty space), asymmetry, restraint, the sense that a scroll is a sequence of composed panels rather than a stream of sections. We borrow the philosophy — how type and space carry meaning — never the layout, assets, or branding.

**Spider-Verse / Miles Morales** supplies the *energy* half: red/blue chromatic separation, halftone (Ben-Day dot) texture, misregistered "print" offsets, comic-panel gutters between sections, occasional glitch as punctuation. This is a color and texture language, not a fandom reference. No spider imagery, no logos, no characters, no comic panels lifted from the source — the deliverable must never read as fan art.

These two references merge into one thing: **an editorial site that happens to use a red/blue chromatic identity**, not a comic site with big type stapled on. When the two pull in different directions, editorial restraint wins — energy is the accent, not the default state.

## Already in motion, not starting from zero

The current codebase (see [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)) already implements real pieces of this language: halftone background, RGB-ghosted hero photo, chromatic title glitch, comic-panel section dividers. The creative direction here is a **continuation and completion** of a direction Salvador already started, pushed into a cinematic, scroll-driven register with GSAP — not a pivot to something new. Recent visual work should read as an earlier draft of this document, not as something being overwritten.

## What the site must feel like

- An experimental digital studio site.
- An editorial publication.
- A premium creative developer portfolio.
- A cinematic, scroll-controlled experience.
- Confident, technically sophisticated, minimal.

## What the site must never feel like

- A SaaS landing page.
- A dashboard.
- A generic AI-generated portfolio template.
- A Tailwind-component-library showcase.
- A Dribbble clone.
- A Spider-Man fan site.
- An effects demo reel that forgot it needed to communicate something.

**Working test**: if removing an effect makes the page *better*, remove it. The design has to hold up with all motion turned off (this is also the `prefers-reduced-motion` requirement, not just a taste rule — see [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md)).

## Storytelling philosophy

Content is revealed progressively through scroll, never dumped all at once. The hero is a three-state scroll story (see below). Each project is a small case study told in beats — problem, approach, result, tech — not a card with everything visible on load. The reader should feel like they're moving *through* a sequence someone composed, not scanning a page someone assembled.

This applies to language too: Spanish and English are treated as two designed versions of the same story, not literal translations. Spanish runs longer — type and layout must survive that without special-casing one language as the "real" one (see i18n notes in [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)).

## Section hierarchy (initial release)

```
01  HERO
02  SELECTED WORK
03  STACK
04  EXPERIENCE
05  CONTACT
```

No LAB / EXPERIMENTS section yet — deliberately postponed until there's real experimental work to show. Do not fill that gap with placeholder content.

## Project storytelling concept

Each of the four real projects (Portal Municipal, Postas POS, EMOS, Estudio Jurídico) gets an editorial case-study treatment answering, in order: what was this → what problem existed → what did Salvador do → what was the result → what tech was involved. Real metrics (currently: `+9,000 weekly users` for Portal Municipal) get visual emphasis where they exist and are omitted, not invented, where they don't. Screenshots become large compositional objects, not thumbnails in a card — but never distorted past the point of a recruiter recognizing the actual interface.

Portal Municipal leads (strongest case study, real government-scale usage). Order is fixed: Portal Municipal → Postas → EMOS → Estudio Jurídico, matching increasing-to-decreasing scale of story, per the brief.

## The recruiter test

Before shipping any section, it has to pass:

- Can a recruiter understand who Salvador is within 5 seconds? → improve the hero if not.
- Can they understand what he actually worked on? → improve project storytelling if not.
- Does it feel memorable? → improve art direction if not.
- Does it stay fast and usable? → optimize if not.

Spectacle never outranks these four questions.
