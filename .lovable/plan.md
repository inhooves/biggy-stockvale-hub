## Goal

Replace the current "drop and bounce" intro with a refined **zip-reveal transition**: a half-sized grocery bag slides smoothly from the top of the screen to the bottom, and as it travels it acts like a zipper pull — splitting two purple panels apart (left and right) to reveal the destination page underneath.

## Visual concept

```text
   ┌────────── viewport ──────────┐
   │ purple ░░░░░│░░░░░ purple    │   bag enters from top center
   │ panel  ░░░░░│░░░░░  panel    │   ───┐
   │ ░░░░░░░░░░░░│░░░░░░░░░░░░░   │      │ bag slides down
   │ ░░░░░░░░░░░░│░░░░░░░░░░░░░   │      │ panels split outward
   │ ░░░░░░░░░░░░🛍️░░░░░░░░░░░░   │      │ revealing page
   │   page peeking through gap    │   ───┘
   │                               │
   └───────────────────────────────┘
```

The bag is the "zipper head". As it descends the gap between the two purple panels widens at the bag's current Y position — producing a true zipper-opening feel rather than a simple wipe.

## Animation timeline (≈1.6s, single play per route change)

1. **0.00s** — Both purple panels cover the screen. Bag positioned just above viewport, scaled to ~50% of previous size (`max-h-[260px]`, `h-[28vh]`).
2. **0.00 → 1.20s** — Bag translates from `y: -20vh` to `y: 110vh` with a smooth `easeInOut` curve (no bounce, gentle scrolling motion). A subtle vertical sway (±6px) and slow rotation (±3°) sells the "hanging package" feel.
3. **0.10 → 1.30s** — Left panel slides out to `-100%` X, right panel slides out to `+100%` X, but driven by a `clipPath` polygon that opens a triangular wedge tracking the bag's Y. This produces the zipper effect (wider at top, narrowing to where the bag currently is).
4. **1.20 → 1.60s** — Panels finish exiting; bag fades out as it leaves the bottom; soft purple vignette fades.

## Aesthetic details (purple theme blend)

- Panels use the existing token palette: gradient `hsl(var(--primary))` → `hsl(245 50% 18%)` for depth.
- Inner edge of each panel has a **gold/violet glowing seam** (`hsl(var(--accent))` + `hsl(var(--primary))`) — this is the "zipper teeth" line, with a faint shimmer animating along it.
- A small trail of 4–5 sparkle particles drifts behind the bag as it descends, in primary + accent colors, reusing the existing burst-particle styling but softer.
- Drop shadow on the bag uses `--primary` glow so it reads as part of the brand.
- Backdrop behind the page (visible through the widening gap) is the actual page — no extra overlay — so the reveal is clean.

## Implementation (single file change)

**Edit `src/components/PageIntro.tsx`** — keep the same export, route-change trigger, `AnimatePresence`, and `pointer-events-none` wrapper. Replace the internal animation with:

- Two `motion.div` panels (`left-panel`, `right-panel`) absolutely positioned, each 50% width, animated via `clipPath` keyframes synced to the bag's Y progress so the opening tracks the bag.
- One `motion.div` bag wrapper animating only `y`, `rotate`, and a tiny `x` sway. Image rendered at half the previous size.
- A thin vertical `motion.div` "seam line" centered on the split, fading out as the panels separate.
- 5 sparkle `motion.span` elements with staggered delays trailing the bag.
- Total intro duration shortened from 1.9s to ~1.6s and `setTimeout` updated accordingly.

No other files change. `App.tsx`, `index.css`, the grocery-bag asset, routes, and all page content remain exactly as they are — this is purely the UX overlay.

## Acceptance criteria

- Bag is visibly ~half its current size.
- Bag enters from the top and slides smoothly downward in one continuous scrolling motion (no bounce/squash).
- Purple panels split open like a zipper that follows the bag's vertical position, revealing the destination page underneath.
- Animation triggers on every route change and never blocks clicks (already `pointer-events-none`).
- Colors stay within the existing purple/violet/accent palette — no off-brand hues.