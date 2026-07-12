# Design

## Aesthetic direction

**Paper-and-ink.** Keyholder is a document, not a dashboard: the page should feel like a
well-typeset personal letter or a will — warm cream paper, dark ink text, a single deep
sealing-wax red used sparingly for the one or two actions that matter (export, the "nothing
left this browser" confirmation). This is deliberately not another dark-surface tech-tool
theme; the content is personal and a little solemn, and the craft is in making that feel calm
and trustworthy rather than clinical.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5f1e8` | Page background — warm cream paper |
| `--surface-1` | `#fffdf8` | The "sheet" — form card and preview pane |
| `--surface-2` | `#ece5d3` | Secondary panels, section dividers |
| `--text` | `#241f18` | Body text — near-black ink brown, never pure `#000` |
| `--text-muted` | `#6b6255` | Labels, helper text, the network-banner subtext |
| `--accent` | `#8a2422` | Sealing-wax red — primary actions (Export PDF), focus rings |
| `--accent-support` | `#2c4a3e` | Deep ink green — secondary actions, links, section headers |
| `--success` | `#2f6b4f` | Save/export confirmation states |
| `--danger` | `#b3261e` | Validation errors |

**Type pairing:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif, has
real personality at large sizes — used for the wordmark, page title, and section headers) +
[Inter](https://fonts.google.com/specimen/Inter) (UI sans — form labels, body copy, buttons).
System fallback stack: `Georgia, 'Times New Roman', serif` for Fraunces, `-apple-system,
BlinkMacSystemFont, 'Segoe UI', sans-serif` for Inter.

**Spacing:** 8px base unit (8/16/24/32/48/64).

**Corner radius:** 2px on the paper sheets themselves (a document doesn't have rounded
corners); 6px on interactive controls (buttons, inputs) so they read as UI, not paper.

**Shadow:** a single soft, warm-toned lift — `0 2px 8px rgba(36, 31, 24, 0.12)` — as if the
sheet is resting just above the desk. No glows; this direction has weight, not glow.

**Motion:** UI transitions 150ms ease-out (hover/focus/active on buttons and inputs). No game
feedback loop needed — this direction is calm by design, not high-energy.

## Layout intent

The **live preview pane** is the hero — it's the document itself, styled as an actual sheet of
paper (subtle shadow, thin border, `--surface-1` against the `--bg` cream). It should read as
"the thing you're actually making," with the form feeling like a control panel beside it.

- **1440×900 desktop:** two columns. Form at ~38% width on the left, the paper preview at ~62%
  on the right, so the document itself dominates the fold (>60% of viewport width, full
  viewport height). Both columns scroll independently once content exceeds the fold.
- **390×844 phone:** single column. Form first, preview below it, both full-width. The preview
  sheet keeps its paper shadow/border so it never reads as a dead gray box — it's always
  visually "a page," even stacked.

## Signature detail

An animated wordmark: "Key" in `--text`, "holder" in `--accent-support`, with a small hand-drawn
key glyph between them that does a single gentle rotate-and-glint (CSS animation, ~600ms,
runs once on load, respects `prefers-reduced-motion`) — evoking a wax seal breaking, not a
loading spinner. The page background carries a very subtle paper-grain texture (CSS noise via
a repeating SVG filter, low opacity) so the cream isn't a flat empty color.

## Games/toys juice plan

Not applicable — Keyholder is a document tool, not a game. The "feel good to use" bar here is
instant live-preview updates (<16ms typing latency) and a satisfying, deliberate PDF export
button state (visibly depresses on click, brief success flash in `--success` before the
browser's save dialog appears), not game-style juice.
