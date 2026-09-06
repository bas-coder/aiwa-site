# Ambient background alternatives (nodes / particle network)

The current effect is the **stage-wire** canvas in the hero (`#stage-wire` in `public/js/motion/hero.js`): drifting particles with neighbour curves. Because `#hero-media` is fixed/pinned for the full hero run, that network reads behind **every hero panel**, not just the opening frame — which is why it feels “site-wide” even though it is not painted in Features / Pricing / etc.

**Status:** research only. Nothing swapped in yet. Decision later: replace, keep hero-only, or remove.

---

## Alternatives worth considering for AIWA

| # | Direction | Who uses it well | Why it fits AIWA | Risk |
|---|-----------|------------------|------------------|------|
| 1 | **Warm mesh / aurora glow** — soft blurred brand-colour blobs that drift slowly | Stripe, Linear, Vercel marketing | Matches amber accent without “AI network” cliché; calm behind copy | Easy to oversaturate; keep to 2–3 warm stops |
| 2 | **Film grain / noise overlay** — static or 24fps speckled texture on flat ground | Linear, Notion, Arc, Vercel | Tactile depth with almost zero motion; premium dark UIs | Alone can feel empty; best paired with #1 or #3 |
| 3 | **Section-scoped ambient blobs** (you already have `data-blob`) — one glow per section, not a continuous field | Many product landers | Already in the codebase; intentional per-section atmosphere | Don’t stack with a full-viewport network |
| 4 | **Faint perspective grid + radial fade** — technical without particles | Raycast, many designer-tool sites | “Builder / IDE” read without sci-fi nodes | Can feel cold if too blue-grey |
| 5 | **Cursor spotlight / vignette** — soft light that follows pointer on hero only | Cards on Linear-style sites, Aura/Dreamcut family | Interactive presence without perpetual particle CPU | Needs hover; useless on touch — keep subtle |
| 6 | **Animated SVG paths / strokes** — slow bezier ribbons | Modern Framer/Motion demos | Elegant motion, GPU-friendly strokes | Can feel decorative if unrelated to product |
| 7 | **Hero product light only** — no ambient FX; let the product canvas + photography carry depth | Apple, many high-end SaaS | Clearest hierarchy; least “template AI” | Relies on strong hero media (you have it) |
| 8 | **God-rays / soft volumetric wash** (shader) | Paper Shaders demos, cinematic tools | Cinematic if tuned to amber | Heavy if misused; hero-only or skip |

---

## Recommendation ladder (when you pick)

1. **Best default for AIWA:** lighten page (done) + **hero-only** warm mesh/grain — kill the particle network everywhere else (or entirely).
2. **If you want motion:** keep **one** language — either mesh drift **or** section blobs — not both fighting the wire canvas.
3. **Fallback if nothing feels worthy:** remove wire from all panels; leave hero media / product scenes as the only atmosphere.

---

## References checked

- Dreamcut / Meng To — darker chrome over lifted ground; restrained ambient
- Stripe / Linear / Vercel — mesh + grain, not particle graphs
- Raycast-style — grid fade / spotlight, product-first
- Paper Shaders / shadcn background kits — mesh, grain, paths catalogs
