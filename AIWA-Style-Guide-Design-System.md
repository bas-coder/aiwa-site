# AIWA Lander — Frontend Implementation Brief

> **This file is the only deliverable.** Implement from this document alone. Do not assume access to the lander repo, `tokens.css`, or any other codebase. Every token, class, HTML structure, CSS rule, and JS module needed for the scoped work below is written out in full.
>
> Scope of this brief: **design tokens**, **header (2 states + liquid glass)**, **primary + secondary buttons**, **hero layout**, **avatar row**, **beam collision**, **prompt-box pattern**. Copy below is AIWA-facing; layout inspiration is from the Pressmaster-style reference described in §5.3.

---

## 0. Non-negotiables

1. Use **only** the CSS custom properties in §1. Do not invent new brand colors.
2. Honor `prefers-reduced-motion: reduce` — every loop becomes a designed static frame.
3. Visitor-facing copy: **no em-dashes** (`—`). Use commas, periods, or hyphens.
4. SVG / icon fills and strokes must use AIWA tokens (or `currentColor` pointing at them). No foreign brand hex.
5. Buttons must match the **live dashboard** (`app.aiwa.codes/auth`) specs in §5.2 — not generic orange pills.
6. Ship drop-in code as written. Tune numbers only if the visual match fails QA against the descriptions in each section.

---

## 1. Design tokens (paste into `:root`)

```css
:root {
  /* Easing */
  --ease-brand: cubic-bezier(0.625, 0.05, 0, 1);
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Duration */
  --dur-micro: 350ms;
  --dur-base: 400ms;
  --dur-entrance: 500ms;
  --dur-reveal: 800ms;
  --dur-atmosphere: 1000ms;
  --dur-sweep: 1000ms;
  --dur-click: 200ms;
  --dur-shimmer: 800ms;

  /* Motion distances */
  --y-reveal: 2em;
  --blur-reveal: 20px;
  --radius-card: 2.5rem;
  --scale-press: 0.95;
  --scale-hover: 1.05;

  /* Ink (backgrounds) */
  --ink-900: #060504;
  --ink-850: #0b0907;
  --ink-800: #121211;
  --ink-700: #1c1811;
  --ink-600: #2a251e;
  --ink-500: #444443;
  --line-alpha: 40%;
  --line: color-mix(in srgb, var(--ink-600) var(--line-alpha), transparent);

  /* Cream (type) */
  --cream-050: #fbf9f6;
  --cream-100: #efeae1;
  --cream-300: #ada598;
  --cream-500: #8a8175;

  /* Accent / glow */
  --accent: #fea002;
  --accent-light: #f0a94e;
  --accent-hot: #f2813e;
  --accent-deep: #bf4e0b;
  --accent-glow: rgba(254, 160, 2, 0.14);
  --glow-dark: var(--accent);
  --glow-light: var(--accent-light);
  --glow-inset: #fe9e00;
  --good: #4ade80;

  /* Dashboard button sunset (exact live values — prefer these on CTAs) */
  --sunset-1: #ffb300;
  --sunset-2: #ff5e00;
  --sunset-3: #ce1400;
  --btn-primary-ink: #1f1f1e;
  --btn-secondary-border: rgba(248, 248, 246, 0.08);
  --btn-secondary-hover: #353533;
  --btn-secondary-ink: #f8f8f6;

  /* Gradient sweep stops (ghost hover / accents) */
  --stop-1: #fea002;
  --stop-2: #f2813e;
  --stop-3: #ffd28a;
  --stop-4: #bf4e0b;
  --stop-5: #e0a030;

  /* Type */
  --font-display: 'Bricolage Grotesque', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  --weight-regular: 400;

  /* Layout (Duda-scale structure, AIWA measure) */
  --gutter: clamp(1.25rem, 4vw, 4.5rem);
  --measure: 78rem;
  --nav-h: 4.5rem;
  --nav-logo-h: 2.6rem;
  --nav-stuck-max: 1200px;

  /* Liquid glass */
  --glass-tint: rgba(251, 249, 246, 0.06);
  --glass-tint-stuck: rgba(11, 9, 7, 0.22);
  --glass-blur: 12px;
  --glass-blur-refract: 2px;
  --glass-saturate: 1.65;
  --glass-brightness: 1;
  --glass-rim: rgba(251, 249, 246, 0.04);
  --glass-rim-soft: rgba(251, 249, 246, 0.025);
  --glass-specular: rgba(255, 255, 255, 0.08);
  --glass-sheen: rgba(255, 255, 255, 0.05);
  --glass-sheen-mid: rgba(255, 255, 255, 0.025);
  --glass-highlight: rgba(255, 255, 255, 0.07);
  --glass-highlight-falloff: 0.42;
  --glass-drop: 0 10px 40px rgba(0, 0, 0, 0.28);
  --glass-displace-scale: -8;
  --glass-displace-rim: 0.1;
}
```

### Fonts (required)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

### Page ground

```css
html, body {
  background: var(--ink-900);
  color: var(--cream-050);
  font-family: var(--font-body);
}
```

---

## 2. Typography utilities (exact sizes)

```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: var(--weight-regular);
  line-height: 0.94;
  letter-spacing: -0.03em;
}

.t-display {
  font-size: clamp(3rem, 8.2vw, 8.5rem);
  line-height: 0.88;
  letter-spacing: -0.045em;
  color: var(--cream-050);
}

.t-h2 { font-size: clamp(2.2rem, 5vw, 4.4rem); }
.t-h3 { font-size: clamp(1.5rem, 2.6vw, 2.4rem); }
.t-h4 { font-size: clamp(1.15rem, 1.7vw, 1.5rem); line-height: 1.1; }

.t-body {
  font-size: clamp(1rem, 1.1vw, 1.125rem);
  color: var(--cream-300);
  line-height: 1.6;
}

.t-small { font-size: 0.875rem; color: var(--cream-500); }
.t-mono {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
}
```

---

## 3. Layout primitives

```css
.shell {
  width: 100%;
  max-width: var(--measure);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.shell--wide { max-width: 96rem; }

.section {
  position: relative;
  padding-block: clamp(5rem, 11vh, 9rem);
}

.section__lead { max-width: 46rem; }
```

**Sizing intent (from Duda-style marketing headers):** generous horizontal gutter, pill nav that reads as one floating object, hero first viewport with brand + one headline + one support line + one CTA group + one dominant visual. Do not crowd the first viewport with stats strips, schedules, or secondary promo blocks.

---

## 4. Motion helpers (JS — self-contained)

Use these literals in every motion module. Do **not** invent new easings or durations.

```js
export const EASE = {
  brand: 'cubic-bezier(0.625, 0.05, 0, 1)',
  out: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const DUR = {
  micro: 0.35,
  base: 0.4,
  entrance: 0.5,
  reveal: 0.8,
  atmosphere: 1.0,
  click: 0.2,
};

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

---

## 5. Components

---

### 5.1 Header — two states + liquid glass

#### Visual target
- **State A (top of page):** full-width floating pill. Logo left, nav links center, actions right. Soft translucent glass fill. Primary action can be "Start Building"; include "Login" as ghost if two actions are used.
- **State B (scrolled / stuck):** same pill, but **max-width `1200px`**, centered, slightly denser fill (`--glass-tint-stuck`), liquid-glass refraction + cursor specular. Transition must feel continuous — class toggle only, no DOM rebuild.

#### HTML

```html
<nav id="nav" class="nav" aria-label="Primary">
  <div class="nav__inner">
    <span class="nav__glass" aria-hidden="true"></span>

    <a class="nav__logo" href="#top" aria-label="AIWA home">
      <!-- AIWA wordmark / logo SVG -->
      <img src="/images/aiwa-logo.svg" alt="" width="120" height="32" />
    </a>

    <div class="nav__links">
      <a href="#product">Product</a>
      <a href="#why">Why AIWA</a>
      <a href="#pricing">Pricing</a>
      <a href="#faq">FAQ</a>
    </div>

    <div class="nav__actions">
      <a class="btn btn--ghost nav__cta" href="https://app.aiwa.codes/auth">
        <span class="btn__label">Login</span>
      </a>
      <a class="btn btn--primary nav__cta" href="#pricing">
        <span class="btn__label">Start Building</span>
      </a>
    </div>
  </div>
</nav>
```

#### CSS (complete)

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0.9rem var(--gutter);
}

.nav__inner {
  --nav-mx: 28%;
  --nav-my: 0%;
  position: relative;
  isolation: isolate;
  max-width: 82rem;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border-radius: 999px;
  transition:
    max-width var(--dur-base) var(--ease-brand),
    padding var(--dur-base) var(--ease-brand);
}

.nav__inner > :not(.nav__glass) {
  position: relative;
  z-index: 1;
}

.nav__glass {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  background: var(--glass-tint);
  border: 1px solid transparent;
  backdrop-filter:
    blur(var(--glass-blur))
    saturate(var(--glass-saturate))
    brightness(var(--glass-brightness));
  -webkit-backdrop-filter:
    blur(var(--glass-blur))
    saturate(var(--glass-saturate))
    brightness(var(--glass-brightness));
  box-shadow:
    var(--glass-drop),
    0 0 1px 1px var(--glass-rim),
    inset 0 1px 3px var(--glass-specular),
    inset 0 -1px 3px var(--glass-rim-soft),
    inset 1px 0 3px var(--glass-rim-soft),
    inset -1px 0 3px var(--glass-rim-soft);
  transition: background var(--dur-base) var(--ease-brand);
}

.nav__glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    var(--glass-sheen),
    var(--glass-sheen-mid) 32%,
    transparent 58%
  );
  pointer-events: none;
}

.nav__glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    22rem 9rem at var(--nav-mx) var(--nav-my),
    var(--glass-highlight),
    transparent 58%
  );
  opacity: var(--glass-highlight-falloff);
}

/* State B */
.nav.is-stuck .nav__inner {
  max-width: var(--nav-stuck-max); /* 1200px */
}

.nav.is-stuck .nav__glass {
  background: var(--glass-tint-stuck);
}

/* Chromium refraction when JS adds .has-refraction */
@supports (backdrop-filter: url(#nav-liquid)) {
  .nav__inner.has-refraction .nav__glass {
    backdrop-filter:
      blur(var(--glass-blur-refract))
      saturate(var(--glass-saturate))
      brightness(var(--glass-brightness))
      url(#nav-liquid);
    -webkit-backdrop-filter:
      blur(var(--glass-blur-refract))
      saturate(var(--glass-saturate))
      brightness(var(--glass-brightness))
      url(#nav-liquid);
  }
}

.nav-liquid-svg {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

@media (prefers-reduced-transparency: reduce) {
  .nav__glass {
    background: rgba(11, 9, 7, 0.88);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  .nav__glass::before,
  .nav__glass::after { opacity: 0.35; }
}

.nav__logo { display: flex; align-items: center; flex-shrink: 0; }
.nav__logo img { display: block; height: var(--nav-logo-h); width: auto; }

.nav__links {
  display: flex;
  gap: 1.7rem;
  font-size: 0.85rem;
  color: var(--cream-300);
}

.nav__links a {
  color: inherit;
  text-decoration: none;
  transition: color var(--dur-micro) var(--ease-brand);
}

.nav__links a:hover { color: var(--cream-050); }

.nav__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .nav__links { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .nav__inner,
  .nav__glass {
    transition: none;
  }
}
```

#### JS — stuck state (GSAP ScrollTrigger or IntersectionObserver)

**Preferred (GSAP ScrollTrigger):**

```js
export function navState() {
  const nav = document.getElementById('nav');
  if (!nav) return () => {};

  // If GSAP + ScrollTrigger are available:
  const st = ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onToggle: (self) => nav.classList.toggle('is-stuck', self.isActive),
  });

  return () => st.kill();
}
```

**Fallback (no GSAP):**

```js
export function navState() {
  const nav = document.getElementById('nav');
  if (!nav) return () => {};

  const THRESHOLD_PX = 80;
  const onScroll = () => {
    nav.classList.toggle('is-stuck', window.scrollY > THRESHOLD_PX);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
```

#### JS — liquid glass (complete module — paste as-is)

```js
/**
 * Liquid glass for the floating nav.
 * Chromium: SVG displacement map in backdrop-filter (real refraction).
 * Safari/Firefox: frost + rim + sheen still apply; url(#filter) is ignored.
 */

const FILTER_ID = 'nav-liquid';
const SVG_ID = 'nav-liquid-svg';
const MIN_SIZE = 8;
const DISPLACE_SCALE = -8;
const DISPLACE_RIM = 0.1;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function supportsRefraction() {
  try {
    return CSS.supports('backdrop-filter', `url(#${FILTER_ID})`);
  } catch {
    return false;
  }
}

function ensureFilter() {
  let svg = document.getElementById(SVG_ID);
  if (svg) return svg.querySelector('feImage');

  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = SVG_ID;
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('nav-liquid-svg');

  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.id = FILTER_ID;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  filter.setAttribute('x', '-8%');
  filter.setAttribute('y', '-8%');
  filter.setAttribute('width', '116%');
  filter.setAttribute('height', '116%');

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
  image.setAttribute('result', 'map');
  image.setAttribute('preserveAspectRatio', 'none');
  image.setAttribute('x', '0');
  image.setAttribute('y', '0');
  image.setAttribute('width', '100%');
  image.setAttribute('height', '100%');

  const displace = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
  displace.setAttribute('in', 'SourceGraphic');
  displace.setAttribute('in2', 'map');
  displace.setAttribute('scale', String(DISPLACE_SCALE));
  displace.setAttribute('xChannelSelector', 'R');
  displace.setAttribute('yChannelSelector', 'G');

  filter.append(image, displace);
  svg.append(filter);
  document.body.prepend(svg);
  return image;
}

function displacementDataUri(width, height, radius) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const pixels = ctx.createImageData(width, height);
  const data = pixels.data;
  const lastX = Math.max(width - 1, 1);
  const lastY = Math.max(height - 1, 1);
  const mid = 128;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      data[i] = (x / lastX) * 255;
      data[i + 1] = (y / lastY) * 255;
      data[i + 2] = mid;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);

  const rim = Math.max(4, Math.round(Math.min(width, height) * DISPLACE_RIM));
  const inset = rim;
  const innerRadius = Math.max(0, radius - inset);
  ctx.filter = `blur(${rim}px)`;
  ctx.fillStyle = `rgb(${mid}, ${mid}, ${mid})`;
  ctx.beginPath();
  ctx.roundRect(inset, inset, width - inset * 2, height - inset * 2, innerRadius);
  ctx.fill();
  ctx.filter = 'none';

  return canvas.toDataURL('image/png');
}

function paintMap(inner, image) {
  const rect = inner.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  if (width < MIN_SIZE || height < MIN_SIZE) return;

  const radius = parseFloat(getComputedStyle(inner).borderRadius) || height / 2;
  const uri = displacementDataUri(width, height, radius);
  if (!uri) return;
  image.setAttribute('href', uri);
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', uri);
}

/** Call once on boot. Returns teardown. */
export function navLiquidGlass() {
  const inner = document.querySelector('#nav .nav__inner');
  if (!inner) return () => {};

  inner.classList.add('has-liquid-glass');
  const cleanups = [];
  const reduced = prefersReducedMotion();

  if (supportsRefraction()) {
    const image = ensureFilter();
    inner.classList.add('has-refraction');
    paintMap(inner, image);

    const observer = new ResizeObserver(() => paintMap(inner, image));
    observer.observe(inner);
    cleanups.push(() => observer.disconnect());
  }

  if (!reduced) {
    const onMove = (event) => {
      const box = inner.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const mx = ((event.clientX - box.left) / box.width) * 100;
      const my = ((event.clientY - box.top) / box.height) * 100;
      inner.style.setProperty('--nav-mx', `${mx}%`);
      inner.style.setProperty('--nav-my', `${my}%`);
    };
    inner.addEventListener('pointermove', onMove);
    cleanups.push(() => {
      inner.removeEventListener('pointermove', onMove);
      inner.style.removeProperty('--nav-mx');
      inner.style.removeProperty('--nav-my');
    });
  }

  return () => {
    inner.classList.remove('has-liquid-glass', 'has-refraction');
    cleanups.forEach((fn) => fn());
  };
}
```

#### Header transition QA
- [ ] Only `max-width`, padding, and glass `background` change between states
- [ ] No layout jump when `is-stuck` toggles
- [ ] Glass filter stays on in both states (tint changes, filter does not toggle off)
- [ ] Specular highlight follows pointer on fine pointers
- [ ] Reduced motion: no pointer-driven highlight animation; transitions duration 0

---

### 5.2 Buttons — live dashboard exact match

Verified from `app.aiwa.codes/auth` production CSS/JS:

| Variant | Live class / pattern |
|---|---|
| Primary | `.aiwa-primary` — `h-11`, `rounded-full`, sunset gradient |
| Secondary | outline pill — `border-border`, `hover:bg-accent` |

#### Primary — drop-in CSS

```css
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.75rem;                 /* h-11 */
  padding-inline: 1.4rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.875rem;             /* text-sm */
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  isolation: isolate;
}

.btn__label {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.btn--primary {
  border: none;
  font-weight: 600;
  color: var(--btn-primary-ink);   /* #1f1f1e — dark on amber, NOT white */
  background: linear-gradient(180deg, var(--sunset-1), var(--sunset-2));
  /* #ffb300 → #ff5e00 */
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.28),
    inset 0 -10px 18px -10px rgba(255, 190, 80, 0.55),
    0 1px 2px rgba(0, 0, 0, 0.4);
  transition: filter var(--dur-base) var(--ease-out);
}

.btn--primary:hover {
  filter: brightness(1.05);
}

.btn--primary:active {
  filter: brightness(0.97);
  transform: scale(var(--scale-press));
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Optional trailing chevron (hero CTA style) */
.btn--primary .btn__icon {
  font-style: normal;
  font-size: 0.9em;
  letter-spacing: -0.03em;
  opacity: 0.85;
}
```

```html
<a class="btn btn--primary" href="#pricing">
  <span class="btn__label">
    Start Building
    <span class="btn__icon" aria-hidden="true">»</span>
  </span>
</a>
```

#### Secondary — drop-in CSS

```css
.btn--ghost {
  border: 1px solid var(--btn-secondary-border); /* rgba(248,248,246,0.08) */
  background: transparent;
  color: var(--btn-secondary-ink);               /* #f8f8f6 */
  font-weight: 500;
  box-shadow: none;
  transition:
    background-color var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    filter var(--dur-base) var(--ease-out);
}

.btn--ghost:hover {
  background-color: var(--btn-secondary-hover);  /* #353533 */
}

.btn--ghost:active {
  filter: brightness(0.97);
  transform: scale(var(--scale-press));
}
```

```html
<a class="btn btn--ghost" href="https://app.aiwa.codes/auth">
  <span class="btn__label">Login</span>
</a>
```

#### Shared rules
- Height is **fixed** `2.75rem` — do not drive height only with vertical padding.
- Full pill: `border-radius: 999px`.
- Primary label is **dark** (`#1f1f1e`). Secondary label is **cream** (`#f8f8f6`).
- Hover on primary is brightness, not a second fill color.

```css
@media (prefers-reduced-motion: reduce) {
  .btn--primary,
  .btn--ghost {
    transition: none;
  }
  .btn--primary:active,
  .btn--ghost:active {
    transform: none;
  }
}
```

---

### 5.3 Hero — layout + beam + avatars + pattern + prompt

#### Visual target (layout reference)
Dark near-black page. **Left:** headline, support line, avatar stack, CTAs, short trust checklist. **Right:** radiant upward **beam collision** sitting on / above the prompt UI; soft ambient amber bloom; fine technical texture behind the prompt.

Do **not** copy Pressmaster copy, logo, or orange-off-brand hues. Use AIWA tokens and AIWA copy below.

#### Composition rules (first viewport)
- Brand / product presence must be strong (logo in nav + AIWA in headline).
- One headline, one support sentence, one CTA group, one dominant visual (beam + prompt).
- No cards in the hero chrome. Prompt is the interaction surface — that is the exception.
- No floating badges / stickers on the beam.

#### Full hero HTML

```html
<section class="hero" id="top">
  <div class="shell hero__grid">
    <!-- LEFT -->
    <div class="hero__copy">
      <div class="hero-avatars">
        <div class="hero-avatars__stack" aria-hidden="true">
          <img class="hero-avatar" src="/images/avatars/user-1.webp" alt="" width="32" height="32" />
          <img class="hero-avatar" src="/images/avatars/user-2.webp" alt="" width="32" height="32" />
          <img class="hero-avatar" src="/images/avatars/user-3.webp" alt="" width="32" height="32" />
          <img class="hero-avatar" src="/images/avatars/user-4.webp" alt="" width="32" height="32" />
        </div>
        <span class="hero-avatars__label t-small">
          Join <strong>14,000+</strong> builders
        </span>
      </div>

      <h1 class="t-display hero__h1">
        Meet your<br />AI product team
      </h1>

      <p class="t-body hero__lead">
        Describe the product. AIWA plans, builds, tests, and ships a real full-stack app you can open in the browser.
      </p>

      <div class="hero__cta">
        <a class="btn btn--primary" href="#pricing">
          <span class="btn__label">
            Start Building
            <span class="btn__icon" aria-hidden="true">»</span>
          </span>
        </a>
        <a class="btn btn--ghost" href="#demo">
          <span class="btn__label">Book a demo</span>
        </a>
      </div>

      <ul class="hero__checks">
        <li><span class="hero__check" aria-hidden="true"></span> No card needed</li>
        <li><span class="hero__check" aria-hidden="true"></span> Real React + backend code</li>
        <li><span class="hero__check" aria-hidden="true"></span> Live preview in the browser</li>
      </ul>
    </div>

    <!-- RIGHT -->
    <div class="hero__visual">
      <div class="beam-wrap" aria-hidden="true">
        <div class="beam-outer-glow"></div>
        <div class="beam-halo"></div>
        <div class="beam-core"></div>
        <canvas class="beam-canvas" width="600" height="700"></canvas>
        <div class="beam-base-plate"></div>
      </div>

      <div class="hero-prompt-wrap">
        <div class="hero-prompt-pattern" aria-hidden="true"></div>
        <!--
          PROMPT BOX: use your existing AIWA prompt / composer component here.
          Assume it exists. Place it as .hero-prompt so it sits above the pattern
          and directly under the beam base.
        -->
        <div class="hero-prompt">
          <!-- existing prompt markup -->
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Hero layout CSS

```css
.hero {
  position: relative;
  min-height: 100svh;
  padding-block: calc(var(--nav-h) + 2.5rem) 4rem;
  background: var(--ink-900);
  overflow: clip;
}

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;
}

.hero__copy {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 34rem;
}

.hero__h1 { color: var(--cream-050); }

.hero__lead {
  max-width: 32rem;
  color: var(--cream-300);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.35rem;
}

.hero__checks {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: var(--cream-300);
  font-size: 0.9rem;
}

.hero__checks li {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.hero__check {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: var(--sunset-2);
  box-shadow: 0 0 0.55rem color-mix(in srgb, var(--sunset-2) 45%, transparent);
  flex-shrink: 0;
}

.hero__visual {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 36rem;
}

@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }
  .hero__visual {
    order: 2;
    min-height: 28rem;
  }
}
```

---

#### 5.3.1 Beam collision — visual description + code

**What it looks like (must match this, not a flat SVG stroke):**
- A single **vertical column of light** rising from the top edge of the prompt area.
- **Core:** near-white, thin, hot.
- **Inner wrap:** warm amber / gold (`--accent` / `--sunset-*` family).
- **Outer bloom:** soft wide amber haze into the dark field.
- **Tendrils:** 2–3 thin curved energy ribbons wrapping the core (heat distortion).
- **Impact:** flared glow along the horizontal top of the prompt surface (base plate).
- Tiny particle flecks optional; keep subtle.

Implementation: layered CSS + canvas tendrils (below).

```css
.beam-wrap {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: clamp(22rem, 48vh, 42rem);
  margin-inline: auto;
  pointer-events: none;
}

.beam-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.beam-core {
  position: absolute;
  left: 50%;
  bottom: 12%;
  transform: translateX(-50%);
  width: 6px;
  height: 72%;
  background: linear-gradient(
    to top,
    #fff 0%,
    rgba(255, 255, 255, 0.9) 30%,
    rgba(255, 255, 255, 0.4) 70%,
    transparent 100%
  );
  border-radius: 999px;
  filter: blur(1.5px);
}

.beam-halo {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  width: 48px;
  height: 68%;
  background: linear-gradient(
    to top,
    var(--accent) 0%,
    var(--accent-light) 35%,
    rgba(240, 169, 78, 0.35) 70%,
    transparent 100%
  );
  border-radius: 999px;
  filter: blur(8px);
  mix-blend-mode: screen;
}

.beam-outer-glow {
  position: absolute;
  left: 50%;
  bottom: 8%;
  transform: translateX(-50%);
  width: 220px;
  height: 60%;
  background: radial-gradient(
    ellipse 50% 80% at 50% 80%,
    color-mix(in srgb, var(--accent) 28%, transparent) 0%,
    color-mix(in srgb, var(--accent-deep) 12%, transparent) 50%,
    transparent 100%
  );
  filter: blur(18px);
  mix-blend-mode: screen;
}

.beam-base-plate {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  width: 160px;
  height: 14px;
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    color-mix(in srgb, var(--accent) 60%, #fff) 0%,
    color-mix(in srgb, var(--accent) 20%, transparent) 70%,
    transparent 100%
  );
  filter: blur(6px);
  border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  .beam-halo { opacity: 0.85; }
}
```

```js
/** Beam tendrils — call once on boot, push teardown into your cleanup array. */
export function beamCollision(root = document) {
  const canvas = root.querySelector('.beam-canvas');
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const ACCENT_RGB = [254, 160, 2]; // --accent #fea002

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function drawStatic(ctx, W, H) {
    const cx = W / 2;
    const baseY = H * 0.88;
    const topY = H * 0.06;
    const grad = ctx.createLinearGradient(cx, baseY, cx, topY);
    grad.addColorStop(0, `rgba(${ACCENT_RGB.join(',')},0.6)`);
    grad.addColorStop(0.4, `rgba(${ACCENT_RGB.join(',')},0.3)`);
    grad.addColorStop(1, `rgba(${ACCENT_RGB.join(',')},0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, baseY);
    ctx.lineTo(cx, topY);
    ctx.stroke();
  }

  if (prefersReducedMotion()) {
    drawStatic(ctx, W, H);
    return () => ctx.clearRect(0, 0, W, H);
  }

  const tendrils = [
    { phase: 0, speed: 0.0008, amp: 38, width: 1.2, opacity: 0.55, curve: -1 },
    { phase: Math.PI * 0.65, speed: 0.0006, amp: 26, width: 0.8, opacity: 0.38, curve: 1 },
    { phase: Math.PI * 1.3, speed: 0.001, amp: 18, width: 0.6, opacity: 0.25, curve: -1 },
  ];

  let raf;
  const start = performance.now();

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    const t = now - start;
    const cx = W / 2;
    const baseY = H * 0.88;
    const topY = H * 0.06;

    tendrils.forEach((td) => {
      const phase = td.phase + t * td.speed;
      const offset = Math.sin(phase) * td.amp;
      const midX = cx + offset * td.curve;
      const midY = H * 0.45;
      const ctrlX1 = cx + offset * 0.3 * td.curve;
      const ctrlY1 = baseY - H * 0.2;
      const ctrlX2 = midX;
      const ctrlY2 = midY - H * 0.12;

      const grad = ctx.createLinearGradient(cx, baseY, midX, topY);
      grad.addColorStop(0, `rgba(${ACCENT_RGB.join(',')},${td.opacity})`);
      grad.addColorStop(0.5, `rgba(${ACCENT_RGB.join(',')},${td.opacity * 0.5})`);
      grad.addColorStop(1, `rgba(${ACCENT_RGB.join(',')},0)`);

      ctx.beginPath();
      ctx.moveTo(cx, baseY);
      ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, midX, topY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = td.width;
      ctx.shadowColor = `rgba(${ACCENT_RGB.join(',')},0.4)`;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}
```

Wire on boot:

```js
const teardowns = [];
teardowns.push(navState());
teardowns.push(navLiquidGlass());
teardowns.push(beamCollision());
// on hot reload / unmount:
// teardowns.forEach((fn) => fn());
```

---

#### 5.3.2 Avatar row

Overlapping circular faces + short label. Replaces any "best warmup algo" style social-proof chip.

```css
.hero-avatars {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hero-avatars__stack { display: flex; }

.hero-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid var(--ink-900);
  object-fit: cover;
  margin-left: -0.5rem;
}

.hero-avatar:first-child { margin-left: 0; }

.hero-avatars__label { color: var(--cream-300); }
.hero-avatars__label strong {
  color: var(--cream-050);
  font-weight: 600;
}
```

**Assets needed from product:** 4 face crops, 32×32 (or 64×64 @2x), square, `.webp`. Until then, use neutral placeholders that still look photographic (not icons).

---

#### 5.3.3 Pattern behind the prompt box

**Visual description (recreate in CSS — do not require the PNG):**
- Dark field with a soft warm bloom.
- Dense cluster of tiny square / dot pixels (~1.5px) on a ~12px grid.
- Cluster is brightest near center-right, fades to empty via a radial mask.
- Reads as atmosphere behind the prompt, never as a competing illustration.
- Amber tint only — use `--accent` + `--cream-050` via `color-mix`.

The **prompt box itself is already in your codebase**. Wrap it; do not rebuild it.

```css
.hero-prompt-wrap {
  position: relative;
  z-index: 1;
  width: min(100%, 28rem);
  margin-top: -2.5rem; /* tuck under beam base */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-prompt-pattern {
  position: absolute;
  inset: -60px -80px;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(
      circle at 50% 50%,
      color-mix(in srgb, var(--accent) 22%, transparent) 0%,
      transparent 68%
    ),
    radial-gradient(
      1.5px 1.5px at center,
      color-mix(in srgb, var(--accent) 55%, var(--cream-050)) 100%,
      transparent 100%
    );
  background-size: 100% 100%, 12px 12px;
  -webkit-mask-image: radial-gradient(
    ellipse 70% 60% at 60% 50%,
    #000 0%,
    #000 35%,
    transparent 80%
  );
  mask-image: radial-gradient(
    ellipse 70% 60% at 60% 50%,
    #000 0%,
    #000 35%,
    transparent 80%
  );
}

.hero-prompt {
  position: relative;
  z-index: 1;
  width: 100%;
}
```

**Tuning:** shift mask center (`60% 50%`) so the dense cluster sits under the beam base. Increase `12px` grid if dots look too busy; decrease if they disappear.

---

## 6. Boot checklist (frontend)

1. Paste §1 tokens into `:root`.
2. Load fonts from §1.
3. Implement header HTML/CSS/JS from §5.1 (stuck + liquid glass).
4. Replace CTA styles with §5.2 primary/secondary everywhere on the lander.
5. Build hero §5.3 grid; drop existing prompt into `.hero-prompt`.
6. Mount `beamCollision()`, `navState()`, `navLiquidGlass()` with teardowns.
7. Run §7 QA.

---

## 7. QA

- [ ] No brand hex outside the token list in §1 (except the documented sunset / button ink values which are themselves tokens).
- [ ] Primary button = vertical `#ffb300 → #ff5e00`, dark label `#1f1f1e`, inset sheen + bottom depth.
- [ ] Secondary button = transparent + `rgba(248,248,246,0.08)` border, hover `#353533`.
- [ ] Nav State B max-width is `1200px`, fully round, denser glass, seamless transition.
- [ ] Liquid glass: specular follows pointer; Chromium gets refraction; Safari still looks glassy.
- [ ] Beam reads as a 3D light column into the prompt top edge, not a diagonal SVG path.
- [ ] Pattern is behind the prompt and uses only accent/cream mixes.
- [ ] Avatar row present; no "best warmup algo" chip.
- [ ] `prefers-reduced-motion`: no looping tendrils, no glass pointer tracking, no transition jank.
- [ ] First viewport stays uncluttered (brand, headline, support, CTAs, beam+prompt only).

---

## 8. Copy lock (use until product changes it)

| Slot | Copy |
|---|---|
| Nav primary | Start Building |
| Nav secondary | Login |
| Hero H1 | Meet your AI product team |
| Hero lead | Describe the product. AIWA plans, builds, tests, and ships a real full-stack app you can open in the browser. |
| Hero primary CTA | Start Building |
| Hero secondary CTA | Book a demo |
| Avatar label | Join **14,000+** builders |
| Checks | No card needed · Real React + backend code · Live preview in the browser |

If product swaps labels later, keep the **styles** in this doc; only change strings.
