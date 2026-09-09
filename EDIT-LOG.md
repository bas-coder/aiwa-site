# AIWA Lander — Edit Log

Running record of design/implementation changes made while owning the lander directly (no markdown-to-frontend handoff). Newest session first.

---

## 2026-09-08 — Hero left copy locked to the matching right scene

- Scene timeline used fixed fractions of the whole hero (plan at 0.20–0.28). Panel 3 is four viewports, so the PLAN robot was still up while “Plans before it builds” was already the left copy. A second 18% lerp on top of Lenis made the canvas lag the text.
- Breaks are measured from the live panels: prompt while panel 1 is in view, PLAN robot with “Watch five agents…”, idea screenshots from the moment the idea list hits viewport center through panel 3, ship on the spacer. ideaScrub uses that same copy-center → panel-bottom window. Extra lerp removed (1:1 scrub).
- Panel 3 gets 100svh of lead padding so the idea list cannot sit under the five-agents line. Statement glue spans stop icon-commas wrapping alone.
- Files: `public/js/motion/hero.js`, `public/js/motion/ideaScrub.js`, `public/css/site.css`, `public/index.html`.

---

## 2026-09-08 — Hero prompt starts with a measured first line

- Root cause: scene timeline typed `{ n: 0 }` and `onUpdate` sliced `PROMPT_TEXT` from character 0, wiping the markup seed as soon as the timeline rendered. Visitors had to scroll the whole prompt in; left copy pulled ahead of the right visual.
- Act 0 now paints one complete line measured from the real string + prompt/scene width (word-snapped; fallback is the phrase through the first colon). Remaining characters still scrub in across the prompt beat only (`0.03–0.16`, hide at `0.20`). Recalculates on the existing width rebuild.
- Files: `public/js/motion/hero.js`, `public/index.html`, `public/css/site.css`.

---

## 2026-09-08 — CTA edge dissolve restored (without clipping “?”)

- Unclip set `.cta { overflow: visible }` and parked fades at `z-index: 0`. That let `.cta__blob` paint past the section, so the top/bottom dissolves no longer defined the rims (blob mask is relative to the oversized SVG, not the section). An opaque fill on `.cta` itself also sat behind any fade and restored a hard rectangle.
- Atmosphere (blob + fades + blurred ink wash + the ink plate) now lives in `.cta__media`: `overflow: hidden` + a vertical mask. `.cta` stays `overflow: visible` and unfilled. Copy is a sibling (`.cta__inner` / `.cta__h2` still overflow-visible, content-box padding, line-height 1.05) so the mask cannot slice `?`.
- Files: `public/index.html`, `public/css/site.css`, `scripts/build-pages.mjs`.

---

## 2026-09-08 — Why AIWA cards: dissolve the visual/text seam

- Audience cards had a knife-edge where the atmosphere well met the solid text plate (grid row cut + `--ink-900` vs plate).
- Visual now masks out on a long ease (`--use-fade`); the body overlaps that fade with a blurred `--ink-850` wash so the two regions melt together. Text stays on the plate. Hero uses the same treatment on the side join, and stacked at ≤900px.
- Files: `public/css/site.css`.

---

## 2026-09-08 — Preloader actually shows

- Logo was CSS `opacity: 0` waiting on GSAP; reduced-motion and sessionStorage removed the overlay before the tween, so refresh looked like no preloader (blank ink, or an instant skip).
- Overlay + mark are visible on first paint (CSS keyframes). JS only ticks stages and dismisses after fonts.ready + a minimum beat. No GSAP, no session skip.
- Inline 5s failsafe if modules never boot. `html.is-loading` locks scroll until dismiss.
- Files: `public/index.html`, `public/css/site.css`, `public/css/base.css`, `public/js/motion/loader.js`, `public/js/main.js`.

---

## 2026-09-08 — CTA “?” still clipped: overflow visible + glyph padding

- `.cta__h2` was already `overflow: visible`; Chromium still sliced the question mark because `background-clip: text` paints inside the padding box, and `line-height: 0.85` plus `-0.045em` tracking left no room for the `?` dot or its right edge.
- Line-height → `1.05`, end/bottom padding, `width: max-content`, overflow visible on the heading and descendants. `[data-grad]` also `overflow: visible`.
- Files: `public/css/site.css`, `public/css/base.css`.

---

## 2026-09-09 — Idea scrub: finish last plate before handoff

- `stageCenter` / `shipShow` no longer start at `ideaEnd - 0.06` (that stole the second half of “Ships a working app”).
- Idea scene holds through scrub end + short beat; ship/stage handoff only after.
- Extra bottom padding on `.hero__panel.is-3` so the last plate can settle before the next beat.
- Files: `public/js/motion/hero.js`, `public/css/site.css`, `public/js/motion/ideaScrub.js`.

---

## 2026-09-09 — Idea visuals: fix blank scrub plates

- Renamed `/images/visuals/*.png` to kebab-case (no spaces) and updated `index.html` srcs.
- Panel images use absolute fill (`inset: 0` + `object-fit: cover`) so aspect-ratio parents don’t collapse paint.
- Stage clips again (`overflow: hidden`) so mid-scrub gaps don’t read as missing art; stride refreshes when each PNG loads.
- Files: `public/images/visuals/*`, `public/index.html`, `public/css/site.css`, `public/js/motion/ideaScrub.js`.

---

## 2026-09-09 — Preloader stages: add SHIP

- Loader stage row is now `PLAN ARCHITECT BUILD TEST SHIP EVOLVE` (uppercase).
- Files: `public/index.html`.

---

## 2026-09-09 — Idea scrub: FAQ fill (`--ink-900`)

- While `.hero__panel.is-3` owns the viewport, `html.is-idea-scrub` flats the canvas to the same `--ink-900` as FAQ/body and fades hero gradient + corner glow.
- Files: `public/js/motion/ideaScrub.js`, `public/css/site.css`.

---

## 2026-09-09 — Hero process marquee: add evolve it

- Kept marquee (five cyclic beats don’t fit a static stagger cleanly).
- Cycle is now `plan it → build it → test it → ship it → evolve it` (duplicated in-group for seamless loop).
- Quieter tone: `data-speed` 30→22 px/s, softer row opacity / step color.
- Files: `public/index.html`, `public/css/site.css`.

---

## 2026-09-07 — CTA “Ready to launch?” unclipped

- `.cta` overflow → `visible`; edge fades dropped under the copy (`z-index: 0`) so the top dissolve no longer slices the display headline.
- Files: `public/css/site.css`.

---

## 2026-09-07 — Idea visuals: no frame, gap, overflow visible

- `.idea__stage`: border removed, `overflow: visible` (glows + next card can peek).
- Stack is a column flex with `--idea-panel-gap`; scrub stride measured in px so the gap travels with each card.
- Panel frame border removed; images still `object-fit: cover`.
- Files: `public/css/site.css`, `public/js/motion/ideaScrub.js`.

---

## 2026-09-07 — Preloader boots before window.load

- `main.js` no longer waits for `window.load` before `runLoader()` — heavy below-fold images were holding the shell at logo `opacity:0`, so the preloader looked missing.
- Loader anim runs immediately (in parallel with `fonts.ready`); entrance still waits on fonts + loader.
- Force replay: `?loader` or `#loader` bypasses the once-per-session gate.
- Files: `public/js/main.js`, `public/js/motion/loader.js`.

---

## 2026-09-07 — Footer wordmark luminosity restored

- Soft dissolve had put `mask` + `backdrop-filter` on `.footer__wordmark-crop`, which isolated the stacking context and cancelled `mix-blend-mode: luminosity` on the logo.
- Mask moved onto `.footer__wordmark`; blur band removed. Crop wrapper is overflow-only again.
- Files: `public/css/site.css`, `public/aiwa22/index.html`.

---

## 2026-09-07 — Idea scrub: center-sticky + Lovable cards

- Left copy sticks at viewport center (`top: 50%` + translate), not under the nav.
- Right visuals: transparent stage; each step is an isolated UI card (dark plate, soft glow, `object-fit: contain`) in the Lovable style; progress line shows only on the active step.
- Files: `public/css/site.css`.

---

## 2026-09-07 — Workspace trim + Why AIWA audience cards

- Workspace: removed the 3 Festova side screens and the caption under the well; main zone is full-width again.
- Why AIWA: CEO “Built for business” copy; static 1-large + 3-card layout; animations (`featureStages`) unwired on home.
- Visuals: EstateFlow finished product on the hero card; client collage from real builds; isolated CRM pipeline + projects-list fragments (Lovable-style, no full-app chrome).
- Files: `public/index.html`, `public/css/site.css`, `public/js/main.js`.

---

## 2026-09-07 — Autonomous QA card → agent-status layout

- Redesigned `#qa` card like the live-agent reference: title + “Powered by Project Brain™”, inner agent panel with pulsing status, icon task list, and status note. No CTA.
- Right side: overlapping AIWA “PASS” route tickets (`/login`, `/checkout`) instead of stock photos.
- Files: `public/index.html`, `public/css/site.css`.

---

## 2026-09-07 — Idea scrub replaces hero “From idea…” beat

- Removed the standalone `#idea` section. The sticky scrub now lives in hero panel `is-3` (left sticky copy + progress lines) with stacked visuals in `.scene--idea` on the pinned canvas (replaces chips + project fan).
- `ideaScrub.js` triggers on the tall panel (no extra pin). Hero scene timeline remapped so the build beat spans that panel’s scroll share.
- Files: `public/index.html`, `public/css/site.css`, `public/js/motion/ideaScrub.js`, `public/js/motion/hero.js`.

---

## 2026-09-07 — Light Framer-like smooth scroll

- Shared `motion/smoothScroll.js`: Lenis with `lerp: 0.1` (not heavy duration), desktop + fine-pointer only, touch left native, reduced-motion off, tab-hidden pause, one RAF via GSAP ticker, in-page anchors via `scrollTo`.
- Wired from `main.js` + `page.js` (replaces Windows-only duration 1.1 setup). Lenis hygiene in `base.css`.

---

## 2026-09-07 — CTA top/bottom edge dissolve restored

- Re-enabled `.cta__fade--top` / `--bottom` (and `.cta` ink plate) so “Ready to launch?” soft-dissolves into FAQ above and footer below again; blob keeps its vertical mask.

---

## 2026-09-07 — Footer wordmark soft dissolve

- Replaced the hard mid-glyph crop on `.footer__wordmark-crop` with a bottom mask fade into the plate, plus a progressive `backdrop-filter` blur band so the wordmark softens before it disappears.
- Files: `public/css/site.css`, `public/aiwa22/index.html`.

---

## 2026-09-07 — Hero card-slash + gallery badge / Use template polish

- Hero microcopy: added Lucide-style `#icon-credit-card-off` before “Try it free · no credit card required” (muted, ~16px).
- Gallery `.shot__badge`: no border, fill at 50% opacity, keep backdrop blur.
- Gallery “Use template” (`.shot__action--ghost`): border removed.
- Files: `public/index.html`, `public/css/site.css`.

---

## 2026-09-07 — From Idea to Working Product sticky scrub

- Added `#idea` sticky scrub section (left copy + progress lines, right stacked visuals) matching the Dribbble-inspired mock; visuals from `/images/visuals/`.
- Replaced home `.feature--hero` mega stage with this scrub; Project Brain is now a regular Why card alongside Architecture / QA / Continuous Evolution.
- New motion: `public/js/motion/ideaScrub.js` (GSAP ScrollTrigger pin + scrub), wired from `main.js`. `featureStages` still early-returns when stage nodes are missing.
- Follow-up: moved `#idea` to sit after `#arc` / before `#engine` so “See the workflow engine” scrolls forward; restored CTA arrow.
- Files: `public/index.html`, `public/css/site.css`, `public/js/main.js`, `public/js/motion/ideaScrub.js`.

---

## 2026-09-07 — CTA dissolve without killing glow.svg

- Opaque `.cta` fill + full-bleed edge fades were painting over fixed `.hero__glow` (main sits above glow in z-order) and cancelling the top-right bloom.
- CTA is transparent again; soft edges come from a vertical mask on `.cta__blob` only.

---

## 2026-09-07 — CTA edge dissolve strengthened

- “Ready to launch?” (`#cta`): taller top/bottom pure-color fades + vertical mask on `.cta__blob` so the screen-blend glow soft-dissolves into FAQ/footer (no backdrop-filter).

---

## 2026-09-07 — Gallery: real projects, badges, hover actions, cursors

- Replaced product-UI plates with 8 real AIWA builds from `public/Real AIWA` (copied URL-safe to `/images/real/`).
- Removed plate numbering + hairline; type badge (Website/App) bottom-right on each frame.
- Hover overlay: Copy prompt (clipboard) + Use template → app templates; touch keeps actions visible.
- Custom cursors from `public/Pointer` → `/icons/cursors/` (default / hover / press / text), fine-pointer only.
- Files: `public/index.html`, `site.css`, `base.css`, `js/motion/gallery.js`, `js/main.js`.

---

## 2026-09-07 — Backdrop blur on translucent cards

- Added `backdrop-filter` / `-webkit-backdrop-filter` (8–12px, matching existing chip/panel language) to card-like surfaces whose fills are translucent (rgba / color-mix with transparency). Fully opaque cards and section-join fades left alone.
- Files: `public/css/site.css`, `public/css/page.css` (`.cases article`, `.card`).

---

## 2026-09-07 — CTA: soft top + bottom edge dissolve

- Softened `#cta` (“Ready to launch?”) top/bottom edges with pure color fades into `--ink-900` (FAQ above, footer gutter below) — same approach as the successful arc→engine join; no backdrop-filter.
- Selectors: `.cta__fade`, `.cta__fade--top`, `.cta__fade--bottom` (shorter heights under `max-width: 620px`).
- Files: `public/index.html`, `public/css/site.css`, `scripts/build-pages.mjs` (ctaBlock template).

---

## 2026-09-07 — Footer wordmark: crop at letter midpoint

- Wrapped display wordmark in `.footer__wordmark-crop` so the plate bottom edge bisects AIWA (top half visible, bottom half clipped).
- CSS: crop window uses `aspect-ratio` from intrinsic 1000×459 at `--fw-crop: 0.5`; keeps luminosity + 0.25 opacity.
- Files: `public/css/site.css`, `scripts/build-pages.mjs`, all 15 public HTML footers.

---

## 2026-09-07 — Footer mid-crop + Framer nav flip

- Footer wordmark sits in `.footer__wordmark-crop` so the plate edge bisects the logo (~50% height).
- Nav underline replaced with Framer-style dual-label vertical flip (`.nav__flip`); reduced-motion / mobile keep a simple color change.

---

## 2026-09-07 — Arc → Engine: seamless join (no hard seam)

- Removed backdrop-filter / mask “blur band” (it drew a hard rectangle and made the join worse).
- Arc ground now ends on `--ink-850`; engine is solid `--ink-850` and overlaps the fade.
- Prompt columns dissolve vertically before the section floor so overflow doesn’t knife-cut them.

---

## 2026-09-07 — Soften Arc → Engine section join

- Hard charcoal/black knife-edge between `#arc` and `#engine` blended: taller `.arc__fade--bottom` into `--ink-850` with stage-fade blur, plus `.engine` top gradient + light blur veil.
- Files: `public/css/site.css`.

---

## 2026-09-07 — Footer: padded plate + big wordmark

- Footer rebuilt as an inset rounded **plate** (padding + `--radius-card`, soft rim, ink-850→950 fill) — layout language from the Dreamcut-style reference the user described; AIWA tokens/links only.
- Hierarchy: logo + newsletter → existing five link columns (unchanged inventory) → © line → oversized **AIWA** display wordmark at the bottom.
- No new URLs or invented legal items; source of truth remains `FOOTER_COLS` in `scripts/build-pages.mjs`.
- Files: `scripts/build-pages.mjs` (source template), `public/css/site.css`, all 15 public HTML footers (home + subpages).
- `npm run pages:build` could not run here (missing monorepo `packages/shared/src/legal.ts`); footers patched in place while preserving per-page `aria-current`.
- Note: no footer screenshot was present in assets/transcript for this request (newest uploads were hero/diagram); built from the user’s layout notes (big bottom wordmark, padding, border radius) + Dreamcut-style plate language used elsewhere on the lander.

---

## 2026-09-07 — Glow.svg: stop hard slice on blur halo

- `<object>` clips to its box; `glow.svg` viewBox padded to `-400 -400 2043 2028` so `feGaussianBlur` isn’t cut into a vertical edge.
- Glow host moved to `body`; sized/positioned for the padded art (`left: 720px`, `top: -320px`).

---

## 2026-09-07 — Workflow ring: bigger arcs, 2px stroke, fixed card anchors

- Arc radius 33.5 → 44; stroke 3 → 2px; robot scaled down so the ring clears it.
- Stage cards use explicit `left`/`top` pentagon anchors (PLAN top → clockwise); GSAP no longer animates `y` (that was stacking every card on the robot).

---

## 2026-09-06 — Hero glow overflow + brand colors

- `.hero__glow` fixed at `left: 900px; top: -200px`, `overflow: visible`, outside `#hero-media` clip; `z-index: 1` so it sits above the opaque canvas ground.
- `glow.svg` fills remapped to brand: `#FEA002` / `#BF4E0B` / fade `#1A1714`.

---

## 2026-09-06 — Workflow diagram ring polish

- Stages on a true 72° polar ring (PLAN at 12 o’clock); bot scaled up (~54%) into the lower gap.
- Replaced marquee filled connectors with five SVG arc-arrows (3px stroke, per-arc gradient 0→100% opacity, arrowhead markers).

---

## 2026-09-06 — Pattern.svg + Glow.svg in hero

- Prompt backdrop: `pattern-2.png` → `/images/Pattern.svg` (masked, centered behind `.prompt`).
- Top-right ambient: `/images/glow.svg` (from `Glow animated.svg`) via `<object>` so CSS keyframes run; `mix-blend-mode: screen`, clipped into the pinned canvas corner.

---

## 2026-09-06 — Pattern (2) behind hero prompt

- Copied Pattern (2) PNG → `public/images/pattern-2.png` (no SVG found in repo).
- Added `.prompt__pattern` layer in `scene--prompt` (`index.html` + `site.css`): absolute, centered, behind `.prompt` + meta only.

---

## 2026-09-05 — Remove hero HUD stage dot

- Removed decorative `.stage__dot` (orange glow) from `.stage__hud-left` in `public/index.html`.
- Deleted unused `.stage__dot` rule from `public/css/site.css`. PLAN label and `00%` unchanged.

---

## 2026-09-06 — Workflow bot true-centre

- `.wf__robot` uses `position:absolute; inset:0; margin:auto` so GSAP `transform` cannot un-centre it.
- Entrance tween is opacity/scale only (no `y`).
- Verified: bot box centre matches `.wf` centre (`dx:0`, `dy:0`); PNG is RGBA, CSS bg transparent.

---

## 2026-09-06 — Hero ribbon visible + live server

- Remounted Balsa ribbon on `#hero-media` (full-bleed, behind frame); float uniforms for WebGL1/ANGLE reliability.
- Persistent init (not torn down on width rebuild); CSS fallback if WebGL fails.
- Live at http://localhost:4300

---

## 2026-09-05 — Hero Balsa studio ribbon

- Ported Balsa Gradient Studio config (`obsidian-fold` / ribbon, seed 1847, colors `#1A1714` → `#583E00` → `#C68C17`) to vanilla WebGL in `public/js/motion/heroGradient.js` (no Vue/Three).
- Canvas `.hero-media__gradient` sits behind hero scenes; pauses offscreen / reduced-motion / hidden tab.

---

## 2026-09-05 — Hide hero ambient orbs

- Soft amber radial glows on `.hero-media__frame::before` set to `display: none` (CSS kept for later swap).
- Hero canvas ground flattened to solid `--ink-900` (no warm top radial).

---

## 2026-09-05 — FAQ restyle (centered accordion)

- Home FAQ: two-column aside layout → centered title + lead + single-column list.
- Accordion: hairline borders removed; rows separated by whitespace; circular `+` / `−` toggles.
- Question/answer contrast: cream questions, muted lead/answers; shared accordion chrome used by builder pages.

---

## 2026-09-05 — PLAN diagram mascot + stage chips

- Replaced `aiwa-bot` with the new open-arms mascot (`public/images/aiwa-bot.png`).
- Hid stage tile badges (`.wf__badge`).
- Stage heading/subtext in filled chips (`.wf__text`).
- Square ring layout; bot centred; five stages repositioned via `data-wf-pos`.

---

## 2026-09-05 — Secondary buttons (Dreamcut tactile)

- `.btn--ghost`: charcoal vertical gradient using dedicated `--btn-secondary-*` tokens (warm darks in the AIWA ink family, not the orange primary).

---

## Earlier

- Undo blobs/border; header rest transparent; nodes removed; statement tiles; Login morph; etc.
