/**
 * Section behaviours: the prompt arc, the horizontal engine, the workspace
 * tabs, the pricing switch, the FAQ accordion, and the footer reveal.
 *
 * Same contract as primitives.js - every export returns a teardown (§5.2).
 */

import { EASE, DUR, STAGGER, prefersReducedMotion } from './tokens.js';
import { queueRefresh } from './scroll.js';

/* ===========================================================================
   THE WORKSPACE FOCUS PULL
   ---------------------------------------------------------------------------
   Coming into this section the hero canvas has not seated yet: it is still a
   large box shrinking toward the well, and <main> paints over it, so the
   workspace heading is laid directly across the picture. That is the moment
   this softens - the image goes out of focus while the words are on top of it,
   and pulls back to sharp as they rise clear of it.

   It reuses .hero-media__scrim rather than filtering anything. That matters:

     - backdrop-filter on the scrim blurs what is painted BEHIND it inside the
       frame, and the frame clips. A `filter` on the media or its frame instead
       creates a containing box whose soft edge shows against the square,
       full-bleed corners the media has for most of this range.
     - nothing else animates this property after load. heroEntrance() writes it
       once, on its atmosphere lift, and then never touches it again, so there
       is no tween fighting this one. The stage's own `filter` IS animated by
       the hero timeline, which is exactly why the blur does not go there.

   The curve holds rather than peaking: it ramps in as the heading arrives,
   SITS at full blur while the heading is over the picture, then pulls focus.
   A plain 1->0 ramp would jump to full blur the instant you scrolled back up
   into the range, because progress 0 would be the blurred end.
   ======================================================================== */
export function workspaceFocus() {
  const scrim = document.querySelector('.hero-media__scrim');
  const head = document.querySelector('.workspace__head');
  if (!scrim || !head) return () => {};

  /* No handoff under reduced motion or below 480px, so the canvas never
     travels behind this heading and there is nothing to pull focus on. */
  if (prefersReducedMotion()
      || document.documentElement.classList.contains('static-hero')) return () => {};

  const MAX = 7;                        // px. "a bit blurred", not frosted over
  const state = { v: 0 };
  const write = () => {
    const px = `blur(${state.v.toFixed(2)}px)`;
    scrim.style.backdropFilter = px;
    scrim.style.webkitBackdropFilter = px;
  };

  const curve = (p) => {
    if (p < 0.18) return p / 0.18;                       // heading arriving
    if (p < 0.55) return 1;                              // heading over the image
    return Math.max(0, 1 - (p - 0.55) / 0.45);           // and pulling clear
  };

  const st = ScrollTrigger.create({
    trigger: head,
    start: 'top 88%',
    end: 'bottom 12%',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => { state.v = MAX * curve(self.progress); write(); },
    /* Both ends of the range are sharp: above it the hero is still showing its
       own scenes, below it the card is seated and is the thing being read. */
    onLeave: () => { state.v = 0; write(); },
    onLeaveBack: () => { state.v = 0; write(); },
  });

  return () => {
    st.kill();
    state.v = 0;
    write();
  };
}

/* ===========================================================================
   WORKSPACE LIFECYCLE TABS
   ---------------------------------------------------------------------------
   The three cards beside the well are tabs. Clicking one puts that screenshot
   in the left well. Build is selected by default.
   The well's aspect-ratio and rect stay untouched so the handoff stays exact.
   ======================================================================== */
const WS_ACTIVE = 'is-active';
const WS_TAB_VIEW = 'is-tab-view';

export function workspaceTabs() {
  const zone = document.getElementById('workspace-zone');
  const well = zone?.querySelector('[data-ws-well]');
  const tabs = [...document.querySelectorAll('.ws-aside [data-ws-aside][data-ws-src]')];
  if (!zone || !well || !tabs.length) return () => {};

  const selectTab = (tab) => {
    const src = tab.getAttribute('data-ws-src');
    if (!src) return;

    tabs.forEach((el) => {
      const on = el === tab;
      el.classList.toggle(WS_ACTIVE, on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
      el.tabIndex = on ? 0 : -1;
    });

    well.src = src;
    well.alt = tab.getAttribute('data-ws-alt') || '';
    zone.classList.add(WS_TAB_VIEW);
    zone.setAttribute('aria-labelledby', tab.id || '');
  };

  const onClick = (event) => {
    const tab = event.currentTarget;
    if (!(tab instanceof HTMLElement)) return;
    selectTab(tab);
  };

  const onKeydown = (event) => {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    const i = tabs.indexOf(event.currentTarget);
    if (i < 0) return;

    let next = i;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (i - 1 + tabs.length) % tabs.length;
    } else {
      next = (i + 1) % tabs.length;
    }

    tabs[next].focus();
    selectTab(tabs[next]);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', onClick);
    tab.addEventListener('keydown', onKeydown);
  });

  /* Build is the default view — matches the hero handoff still. */
  selectTab(tabs[0]);

  return () => {
    tabs.forEach((tab) => {
      tab.removeEventListener('click', onClick);
      tab.removeEventListener('keydown', onKeydown);
      tab.classList.remove(WS_ACTIVE);
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = 0;
    });
    if (tabs[0]) {
      tabs[0].classList.add(WS_ACTIVE);
      tabs[0].setAttribute('aria-selected', 'true');
    }
    zone.classList.add(WS_TAB_VIEW);
    well.src = tabs[0]?.getAttribute('data-ws-src') || well.src;
    well.alt = tabs[0]?.getAttribute('data-ws-alt') || '';
    if (caption) caption.textContent = WS_DEFAULT_CAPTION;
  };
}

/* ===========================================================================
   THE PROMPT ARC
   ---------------------------------------------------------------------------
   Our reading of moto-card's currency wall. There, two columns of foreign
   amounts bow away from a headline so that "0 FX fees" is felt before it is
   read; the amounts are the argument, the headline just names it.
   Here the columns are the sentences people actually type into AIWA.
   Same instrument, our own sentence.
   ---------------------------------------------------------------------------
   moto-card runs theirs on WebGL - a full three.js scene with a gradient
   shader per glyph. That buys a gradient sweep across the whole wall, and
   costs a renderer, a texture cache and a font-atlas. The bow itself is a
   scale and an x-offset per item, both derived from distance to viewport
   centre, and CSS transforms do that at 60fps for free. So: transforms, and
   a CSS gradient on the text for the sweep. Roughly 1% of the code for
   roughly 95% of the read.
   ======================================================================== */

const PROMPTS = [
  'a sales pipeline tracker for SMBs',
  'an AI voice note transcriber',
  'a pet sitting marketplace for neighbors',
  'an invoice chaser for freelancers',
  'an event photo platform',
  'a shift rota for a coffee chain',
  'a client portal with Stripe billing',
  'an internal RAG search over our docs',
  'a booking system for a climbing gym',
  'a habit tracker with streaks',
  'a CRM for a boutique agency',
  'a menu builder for pop-up kitchens',
  'a tenant maintenance request app',
  'a course platform with quizzes',
  'a fleet check-in log for couriers',
  'an inventory count for a bike shop',
  'a donor dashboard for a charity',
  'a photo-approval flow for clients',
];

export function promptArc() {
  const left = document.querySelector('[data-arc-col="left"]');
  const right = document.querySelector('[data-arc-col="right"]');
  const section = document.querySelector('.arc');
  if (!left || !right || !section) return () => {};

  /* Fill both columns. The right column is offset so the two sides never read
     as a mirror - a mirrored wall looks like a mistake, an offset one looks
     like a crowd. */
  const fill = (col, offset) => {
    col.textContent = '';
    for (let i = 0; i < 22; i++) {
      const span = document.createElement('span');
      span.textContent = PROMPTS[(i + offset) % PROMPTS.length];
      col.appendChild(span);
    }
  };
  fill(left, 0);
  fill(right, 7);

  /* The narrow-screen substitute reads from the same list, so there is one
     place to edit the prompts and no chance of the two falling out of step. */
  const railGroup = document.querySelector('[data-arc-rail]');
  if (railGroup && !railGroup.children.length) {
    PROMPTS.forEach((text) => {
      const span = document.createElement('span');
      span.textContent = text;
      railGroup.appendChild(span);
    });
  }

  const items = [...left.children, ...right.children];

  if (prefersReducedMotion()) {
    items.forEach((el) => { el.style.opacity = '0.35'; });
    return () => { left.textContent = ''; right.textContent = ''; };
  }

  /* Per-item transform from distance to viewport centre.
     - bow: a circular profile, so items near the middle push furthest out
     - scale: biggest at the centre, smallest at the edges
     - opacity: fades toward the edges so the columns dissolve rather than crop
     All three read off ONE measurement pass per frame, and we only measure
     when the section is on screen. */
  let raf = 0;
  let live = false;
  const MAX_SHIFT = 120;   // px the centre item bows outward
  const MIN_SCALE = 0.72;
  const MAX_SCALE = 1.25;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!live || document.hidden) return;

    const vh = window.innerHeight;
    const mid = vh / 2;

    for (const el of items) {
      const r = el.getBoundingClientRect();
      const c = r.top + r.height / 2;
      // normalised distance from centre, clamped to [0,1]
      const nd = Math.min(Math.abs(c - mid) / mid, 1);
      // circular profile: 1 at centre, 0 at the edge
      const bow = Math.sqrt(Math.max(0, 1 - nd * nd));
      const dir = el.parentElement === left ? -1 : 1;

      const shift = bow * MAX_SHIFT * dir;
      const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * bow;
      const alpha = 0.14 + 0.62 * bow;

      el.style.transform = `translate3d(${shift.toFixed(2)}px,0,0) scale(${scale.toFixed(3)})`;
      el.style.opacity = alpha.toFixed(3);
    }
  };
  raf = requestAnimationFrame(frame);

  /* §5.3 - .is-live carries the compositor hint for the 44 items, and only
     while the section is actually on screen. */
  const io = new IntersectionObserver(([e]) => {
    live = e.isIntersecting;
    section.classList.toggle('is-live', live);
  }, { threshold: 0 });
  io.observe(section);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    section.classList.remove('is-live');
    left.textContent = '';
    right.textContent = '';
  };
}

/* ===========================================================================
   §3.2 · ENGINE - pinned horizontal scroll, >=992px only.
   ---------------------------------------------------------------------------
   ON THE TRAVEL DISTANCE. The spec gives xPercent: -(100 x (n-1) / n)%, and
   its own note derives -80% for five panels. That formula is only correct when
   every panel is exactly one viewport wide, which is the case it was read out
   of. Ours are a fixed 26rem — six of them overflow the pin — so a % of the
   TRACK's width overshoots badly and leaves the last panel stranded mid-screen
   with dead space beside it. §6 explicitly fails that: "ends exactly at the
   last panel - no dead space."
   So the distance is measured instead: scroll the track by exactly the amount
   it overflows its container, no more. It is a function, not a number, so
   invalidateOnRefresh re-measures it on every resize and after any font or
   image load that changes a panel's width.
   ---------------------------------------------------------------------------
   Below 992px the track becomes a native snap rail. The spec asks for Swiper
   there; a scroll-snap rail is the same interaction, natively, without adding
   a carousel dependency to a page that needs one for exactly one section.
   ======================================================================== */
export function engineHorizontal() {
  const track = document.querySelector('[data-engine-track]');
  const pin = document.querySelector('.engine__pin');
  const section = document.querySelector('.engine');
  const rail = document.querySelector('[data-engine-rail]');
  if (!track || !pin || !section) return () => {};

  const panels = track.children.length;
  const overflow = () => Math.max(0, track.scrollWidth - pin.clientWidth);

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${overflow() + window.innerHeight * 0.5}`,
    pin,
    scrub: true,
    invalidateOnRefresh: true,
    animation: gsap.to(track, { x: () => -overflow(), ease: EASE.scrub }),
    onUpdate: (self) => { if (rail) rail.style.width = `${(self.progress * 100).toFixed(1)}%`; },
  });

  return () => {
    st.kill();
    gsap.set(track, { clearProps: 'all' });
    if (rail) rail.style.width = '';
  };
}

/** Below the horizontal breakpoint the track becomes a snap rail. */
export function engineRail() {
  const track = document.querySelector('[data-engine-track]');
  if (!track) return () => {};
  track.classList.add('is-rail');
  Object.assign(track.style, {
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    width: '100%',
  });
  [...track.children].forEach((el) => { el.style.scrollSnapAlign = 'center'; });
  return () => {
    track.classList.remove('is-rail');
    track.style.overflowX = track.style.scrollSnapType = track.style.width = '';
    [...track.children].forEach((el) => { el.style.scrollSnapAlign = ''; });
  };
}

/* ===========================================================================
   §3.5 · Pricing switch.
   Only the pill animates. The numbers swap instantly - animated digits read as
   unstable next to money, which is the last thing a price should read as.
   ======================================================================== */
/* ===========================================================================
   Credit sliders · the Solo and Agency cards.

   apps/web's CreditSlider (components/billing/PricingTable.tsx), ported. The
   STOPS are the controls: a radiogroup of real buttons, arrow-key navigable,
   with a roving tabindex - not a range input with a draggable thumb. Landing
   on a stop moves the beam, re-heats it, and rewrites the card's whole price
   block.

   THE NUMBERS ARE NOT LOCAL. They are packages/shared/src/constants.ts -
   TIER_STEPS, ANNUAL_MONTHS_BILLED and PROMISE_COSTS - which is what Stripe
   and the API bill from, so a price shown here cannot drift from a price
   charged there. Copy them across when that file changes; do not re-derive
   them.

   BOTH billing modes are written on every change, not just the visible one:
   pricingSwitch() does nothing but toggle [hidden] on the four spans, so the
   pair that is not showing has to already be right.
   ======================================================================== */
const TIER_STEPS = {
  solo: [
    { credits: 200, priceMonthly: 29, label: 'Light builds' },
    { credits: 515, priceMonthly: 59, label: 'Steady shipping', popular: true },
    { credits: 1030, priceMonthly: 119, label: 'Heavy operations' },
  ],
  agency: [
    { credits: 1100, priceMonthly: 149, label: 'Boutique' },
    { credits: 2535, priceMonthly: 299, label: 'Studio pace', popular: true },
    { credits: 4455, priceMonthly: 549, label: 'Heavy operations' },
  ],
};
const ANNUAL_MONTHS_BILLED = 10.5;
const PROMISE_COSTS = { fullApp: 50, edit: 10 };

const annualTotalFor = (priceMonthly) => Math.round(priceMonthly * ANNUAL_MONTHS_BILLED);
const group = (n) => n.toLocaleString('en-US');
/* Outcome framing, floored, so the promise never exceeds what the credits buy. */
const outcomeLine = (credits) =>
  `≈ ${Math.max(1, Math.floor(credits / PROMISE_COSTS.fullApp))} full apps or ${Math.floor(credits / PROMISE_COSTS.edit)} edits / mo`;

/* The markup splits a price as <b>$29</b><em> / mo</em>, so each mode returns
   the two halves. Annual is the 10.5-month total spread over 12. */
function priceParts(step, mode) {
  if (mode === 'monthly') return [`$${step.priceMonthly}`, ' / mo'];
  const total = annualTotalFor(step.priceMonthly);
  const perMonth = total / 12;
  const dollars = Math.floor(perMonth);
  const cents = String(Math.round((perMonth - dollars) * 100)).padStart(2, '0');
  /* No thousands separator on the yearly total: that is the lander's existing
     copy ("billed $1565 yearly"). The credit COUNT is grouped, as in the app. */
  return [`$${dollars}`, `.${cents} / mo · billed $${total} yearly`];
}

export function creditSliders() {
  const roots = [...document.querySelectorAll('[data-credits]')];
  if (!roots.length) return () => {};

  const stops = roots.map((root) => {
    const steps = TIER_STEPS[root.dataset.credits];
    const buttons = [...root.querySelectorAll('[data-credits-stop]')];
    const group_ = root.querySelector('[role="radiogroup"]');
    const beam = root.querySelector('[data-credits-beam]');
    const card = root.closest('.plan');
    if (!steps || !buttons.length || !card) return () => {};

    let idx = 0;

    const apply = (i) => {
      idx = Math.min(steps.length - 1, Math.max(0, i));
      const step = steps[idx];
      const pct = (idx / (steps.length - 1)) * 100;

      root.dataset.heat = String(idx);
      if (beam) beam.style.width = `${pct}%`;
      buttons.forEach((b, n) => {
        const on = n === idx;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });

      const out = root.querySelector('[data-credits-out]');
      const label = root.querySelector('[data-credits-step]');
      const best = root.querySelector('[data-credits-best]');
      const outcome = root.querySelector('[data-credits-outcome]');
      if (out) out.textContent = group(step.credits);
      if (label) label.textContent = ` · ${step.label}`;
      if (best) best.hidden = !step.popular;
      if (outcome) outcome.textContent = outcomeLine(step.credits);

      for (const mode of ['monthly', 'annual']) {
        const [dollars, rest] = priceParts(step, mode);
        const d = card.querySelector(`[data-price="${mode}"]`);
        const n = card.querySelector(`[data-billing-note="${mode}"]`);
        if (d) d.textContent = dollars;
        if (n) n.textContent = rest;
      }
    };

    const onClick = (e) => apply(Number(e.currentTarget.dataset.creditsStop));
    /* Arrow keys move between stops, which is the radiogroup contract. */
    const onKey = (e) => {
      const fwd = e.key === 'ArrowRight' || e.key === 'ArrowUp';
      const back = e.key === 'ArrowLeft' || e.key === 'ArrowDown';
      if (!fwd && !back) return;
      e.preventDefault();
      apply(idx + (fwd ? 1 : -1));
      buttons[idx].focus();
    };

    buttons.forEach((b) => b.addEventListener('click', onClick));
    group_?.addEventListener('keydown', onKey);
    apply(0);

    return () => {
      buttons.forEach((b) => b.removeEventListener('click', onClick));
      group_?.removeEventListener('keydown', onKey);
    };
  });

  return () => stops.forEach((stop) => stop());
}

export function pricingSwitch() {
  const root = document.querySelector('[data-billing-switch]');
  if (!root) return () => {};
  const opts = [...root.querySelectorAll('.switch__opt')];

  const apply = (mode) => {
    root.dataset.billing = mode;
    opts.forEach((o) => {
      const on = o.dataset.billing === mode;
      o.classList.toggle('is-active', on);
      o.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-price]').forEach((el) => { el.hidden = el.dataset.price !== mode; });
    document.querySelectorAll('[data-billing-note]').forEach((el) => { el.hidden = el.dataset.billingNote !== mode; });
  };

  const onClick = (e) => apply(e.currentTarget.dataset.billing);
  opts.forEach((o) => o.addEventListener('click', onClick));
  /* Annual by default. The markup already ships in this state so nothing
     flashes between first paint and this call; re-applying it here keeps the
     two in step if the markup is ever edited. */
  apply('annual');

  return () => opts.forEach((o) => o.removeEventListener('click', onClick));
}

/* ===========================================================================
   §3.6 · FAQ accordion.
   JS only flips data-accordion-status. The open/close animation is
   grid-template-rows 0fr -> 1fr in CSS, so nothing here measures a height -
   which is what makes it correct at every font size and on first paint.
   .has-open on the container is what disables the sibling-dim once something
   is open, per the spec.
   ======================================================================== */
export function accordion() {
  const root = document.querySelector('[data-accordion]');
  if (!root) return () => {};
  const closeSiblings = root.dataset.accordionCloseSiblings === 'true';
  const items = [...root.querySelectorAll('.accordion__item')];

  const setState = (item, active) => {
    item.dataset.accordionStatus = active ? 'active' : 'not-active';
    item.querySelector('.accordion__head')?.setAttribute('aria-expanded', String(active));
  };

  const onClick = (e) => {
    const item = e.currentTarget.closest('.accordion__item');
    const willOpen = item.dataset.accordionStatus !== 'active';
    if (closeSiblings) items.forEach((i) => i !== item && setState(i, false));
    setState(item, willOpen);
    root.classList.toggle('has-open', root.querySelector('[data-accordion-status="active"]') !== null);
    /* An opening panel changes page height under every trigger below it. Queue
       the re-measure instead of taking it now: a refresh mid-scroll kills
       momentum scrolling on iOS (§5.4). */
    queueRefresh();
  };

  const heads = items.map((i) => i.querySelector('.accordion__head'));
  heads.forEach((h) => h?.addEventListener('click', onClick));

  return () => heads.forEach((h) => h?.removeEventListener('click', onClick));
}

/* ===========================================================================
   §3.8 · Footer - one blur+fade, fires once, will-change cleared after.
   ======================================================================== */
export function footerReveal() {
  const footer = document.querySelector('[data-footer]');
  if (!footer) return () => {};
  if (prefersReducedMotion()) { footer.classList.add('is-in'); return () => {}; }

  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    // set it here, not at init: hinting from page load means the hint stands
    // for the entire scroll down the page, for one 800ms fade at the end
    footer.style.willChange = 'opacity, filter';
    footer.classList.add('is-in');
    io.disconnect();
    setTimeout(() => { footer.style.willChange = ''; }, 500);
  }, { threshold: 0.3 });
  io.observe(footer);

  return () => io.disconnect();
}

/** The mobile menu. Below 900px the links live behind a toggle. */
export function navMenu() {
  const nav = document.getElementById('nav');
  const burger = nav?.querySelector('.nav__burger');
  if (!nav || !burger) return () => {};

  const close = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  const toggle = () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', toggle);
  nav.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', close));
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);

  return () => {
    burger.removeEventListener('click', toggle);
    document.removeEventListener('keydown', onKey);
    close();
  };
}

/** Nav gets a solid backing once you are off the hero.
 *  Also crossfades the CTA: Login (ghost) at rest → Start Building (primary) when stuck. */
export function navState() {
  const nav = document.getElementById('nav');
  if (!nav) return () => {};

  const login = nav.querySelector('.nav__cta--login');
  const build = nav.querySelector('.nav__cta--build');

  const syncCta = (stuck) => {
    if (!login || !build) return;
    login.tabIndex = stuck ? -1 : 0;
    build.tabIndex = stuck ? 0 : -1;
    login.setAttribute('aria-hidden', stuck ? 'true' : 'false');
    build.setAttribute('aria-hidden', stuck ? 'false' : 'true');
  };

  const st = ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onToggle: (self) => {
      nav.classList.toggle('is-stuck', self.isActive);
      syncCta(self.isActive);
    },
  });
  syncCta(nav.classList.contains('is-stuck'));
  return () => st.kill();
}
