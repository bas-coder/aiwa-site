# AIWA Lander — Edit Log

Running record of design/implementation changes made while owning the lander directly (no markdown-to-frontend handoff). Newest session first.

---

## 2026-09-05 — Remove hero HUD stage dot

- Removed decorative `.stage__dot` (orange glow) from `.stage__hud-left` in `public/index.html`.
- Deleted unused `.stage__dot` rule from `public/css/site.css`. PLAN label and `00%` unchanged.

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
