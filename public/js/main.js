/**
 * Boot.
 *
 * Order matters here and is not negotiable (§2.6): scroll normalisation first,
 * then everything scroll-driven. Every trigger takes invalidateOnRefresh, and a
 * WIDTH resize KILLS AND REBUILDS rather than refreshing - a refreshed trigger
 * measured against the old viewport lands the card a few pixels off every time,
 * and that reads as a rendering bug rather than the measurement bug it is.
 *
 * Height-only resizes are ignored on purpose: that is mobile browser chrome
 * collapsing, not a new layout, and rebuilding on it destroys the pin
 * mid-scroll.
 */

import { blurReveal, gradientText, marquees, springHovers, glassHighlights } from './motion/primitives.js';
import { heroEntrance, heroScroll } from './motion/hero.js';
import { heroGradient } from './motion/heroGradient.js';
import { blobs } from './motion/blob.js';
import { ideaScrub } from './motion/ideaScrub.js';
import { runLoader } from './motion/loader.js';
import {
  promptArc, engineHorizontal, engineRail,
  pricingSwitch, creditSliders, accordion, footerReveal, navState, navMenu, projectStatus, workspaceFocus,
} from './motion/sections.js';
import { galleryActions } from './motion/gallery.js';
import { prefersReducedMotion } from './motion/tokens.js';
import { initRefreshQueue } from './motion/scroll.js';
import { initSmoothScroll } from './motion/smoothScroll.js';

/* Start the overlay before plugin setup. If registerPlugin throws, CSS still
   painted the loader and the failsafe in index.html will tear it down. */
const fontsReady = document.fonts?.ready ?? Promise.resolve();
const loaderDone = runLoader(fontsReady);

try {
  gsap.registerPlugin(ScrollTrigger, SplitText);
} catch (err) {
  console.warn('[boot] gsap plugins', err);
}

/* §2.6 - mobile browser chrome collapsing on scroll changes innerHeight
   constantly. Rebuilding on that destroys the pin mid-scroll. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* =========================================================================
   §5.4 · Smooth scroll — light Lenis on desktop fine-pointer only.
   See motion/smoothScroll.js (Framer-like lerp, no touch smoothing).
   ====================================================================== */
function initLenis() {
  initSmoothScroll();
}

/* =========================================================================
   §5.4 · Normalised scroll, and the refresh queue.
   normalizeScroll only earns its cost while something is pinned, so it is
   switched off the moment the hero is behind us and switched back on if you
   scroll up into it again.
   ====================================================================== */
function initScrollHygiene() {
  initRefreshQueue();
  const wide = window.matchMedia('(min-width: 992px) and (pointer: fine)').matches;
  if (!wide || prefersReducedMotion()) return;

  ScrollTrigger.normalizeScroll(true);
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom bottom',
    onEnter: () => ScrollTrigger.normalizeScroll(false),
    onLeaveBack: () => ScrollTrigger.normalizeScroll(true),
  });
}

/* =========================================================================
   The rebuild contract (§2.6).
   Everything scroll-driven is created inside build() and torn down by the
   functions it collects. Width-only resizes rebuild; height-only ones are
   ignored, because that is the URL bar, not a new layout.
   ====================================================================== */
let teardowns = [];
let cachedWidth = window.innerWidth;

function killAll() {
  teardowns.forEach((fn) => { try { fn(); } catch (e) { console.warn('[teardown]', e); } });
  teardowns = [];
}

function build() {
  killAll();

  const wide = window.matchMedia('(min-width: 992px)').matches;
  const tiny = window.matchMedia('(max-width: 479px)').matches;

  // Always-on primitives.
  teardowns.push(blurReveal());
  teardowns.push(gradientText());
  teardowns.push(marquees());
  teardowns.push(blobs());
  teardowns.push(pricingSwitch());
  teardowns.push(creditSliders());
  teardowns.push(accordion());
  teardowns.push(footerReveal());
  teardowns.push(navState());
  teardowns.push(navMenu());
  teardowns.push(springHovers());
  teardowns.push(glassHighlights());
  teardowns.push(promptArc());
  teardowns.push(projectStatus());
  teardowns.push(workspaceFocus());
  teardowns.push(ideaScrub());
  teardowns.push(galleryActions());

  /* §2.8 tiers 3 and 4 - under 480px, or reduced motion, the hero does not
     pin, so it also does not need four viewports. `.static-hero` collapses it
     to one; see the block comment in site.css. */
  const staticHero = tiny || prefersReducedMotion();
  document.documentElement.classList.toggle('static-hero', staticHero);

  if (!tiny) {
    teardowns.push(heroScroll());
  }

  // §3.2 - horizontal scroll at >=992px, a snap rail below it.
  teardowns.push(wide ? engineHorizontal() : engineRail());

  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

/* Debounced 200ms, width-only. */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth === cachedWidth) return;   // height-only: ignore
    cachedWidth = window.innerWidth;
    build();
  }, 200);
}, { passive: true });

/* =========================================================================
   Start.
   Boot as soon as this module runs (deferred, DOM already parsed). Do NOT wait
   for window.load — below-fold images must not hold the overlay. The loader
   promise is kicked at import so it runs even if later boot work throws.
   fonts.ready still gates SplitText / hero entrance.
   ====================================================================== */
async function start() {
  initLenis();
  initScrollHygiene();

  try { await document.fonts.ready; } catch { /* older browsers: proceed */ }

  // Persistent across width rebuilds (not in teardowns) — self-resizes each frame.
  heroGradient();

  await loaderDone;

  const tooSmall = window.matchMedia('(max-width: 479px)').matches;
  if (!tooSmall) {
    /* Deliberately NOT in `teardowns`. That array is emptied by build(), which
       runs on the next line and again on every width resize; the entrance is a
       one-shot that must survive both. Its own teardown reverts the SplitText
       and applies the final state, so calling it here would undo the animation
       on the frame it started. */
    heroEntrance();
  } else {
    // §2.8 tier 3 - no entrance animation below 480px. Final state, instantly.
    document.getElementById('hero-h1')?.classList.add('is-static');
    gsap.set(['#nav', '.hero [data-entrance]'], { opacity: 1, y: 0 });
    const scrim = document.querySelector('.hero-media__scrim');
    if (scrim) scrim.style.backdropFilter = 'blur(0px)';
  }

  build();
}

start();
