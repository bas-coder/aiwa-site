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
import { featureStages } from './motion/featureStages.js';
import { runLoader } from './motion/loader.js';
import {
  promptArc, engineHorizontal, engineRail,
  pricingSwitch, creditSliders, accordion, footerReveal, navState, navMenu, projectStatus, workspaceFocus,
} from './motion/sections.js';
import { prefersReducedMotion } from './motion/tokens.js';
import { initRefreshQueue } from './motion/scroll.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* §2.6 - mobile browser chrome collapsing on scroll changes innerHeight
   constantly. Rebuilding on that destroys the pin mid-scroll. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* =========================================================================
   §5.4 · Smooth scroll - Windows only.
   macOS and iOS already have good native inertia and Lenis on top of it feels
   syrupy; Windows wheels are steppy and genuinely benefit. This is a taste
   call the reference made and it is the right one, so we keep it.
   ====================================================================== */
let lenis = null;
function initLenis() {
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const isWindows = /win/i.test(platform);
  if (!isWindows || prefersReducedMotion() || typeof Lenis === 'undefined') return;

  lenis = new Lenis({ duration: 1.1, wheelMultiplier: 1.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
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
  teardowns.push(featureStages());

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
   window.load, then fonts.ready - in that order, because SplitText measured
   against fallback metrics re-lays-out the moment the real font arrives and
   the character wipe visibly jumps.
   ====================================================================== */
async function start() {
  initLenis();
  initScrollHygiene();

  try { await document.fonts.ready; } catch { /* older browsers: proceed */ }

  // Persistent across width rebuilds (not in teardowns) — self-resizes each frame.
  heroGradient();

  await runLoader();

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

if (document.readyState === 'complete') start();
else window.addEventListener('load', start);
