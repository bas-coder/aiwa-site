/**
 * Light Framer-like smooth scroll (Lenis).
 *
 * Restraint rules:
 * - Desktop + fine pointer only (native touch inertia is already good).
 * - Off when prefers-reduced-motion.
 * - lerp (not long duration) so it settles quick — not syrupy.
 * - One RAF path via GSAP ticker (autoRaf off) so ScrollTrigger stays in sync
 *   without a second animation loop.
 * - Pauses while the tab is hidden.
 */

import { BP, prefersReducedMotion } from './tokens.js';

const LERP = 0.1;
const WHEEL_MULTIPLIER = 1;
const ANCHOR_DURATION = 0.95;
const NAV_GAP = 8;

let instance = null;

function isDesktopFinePointer() {
  return window.matchMedia(
    `(min-width: ${BP.wide}px) and (pointer: fine)`,
  ).matches;
}

function navOffset() {
  const nav = document.querySelector('.nav');
  return -((nav?.offsetHeight ?? 0) + NAV_GAP);
}

function bindAnchors(lenis) {
  const onClick = (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    if (href === '#top') {
      event.preventDefault();
      lenis.scrollTo(0, { duration: ANCHOR_DURATION, offset: 0 });
      return;
    }

    const id = decodeURIComponent(href.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target, {
      offset: navOffset(),
      duration: ANCHOR_DURATION,
    });
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/** Boot once per page. Survives width rebuilds (same contract as initLenis). */
export function initSmoothScroll() {
  if (instance) return instance;
  if (prefersReducedMotion() || typeof Lenis === 'undefined') return null;
  if (!isDesktopFinePointer()) return null;

  const lenis = new Lenis({
    lerp: LERP,
    wheelMultiplier: WHEEL_MULTIPLIER,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const unbindAnchors = bindAnchors(lenis);

  const onVisibility = () => {
    if (document.hidden) lenis.stop();
    else lenis.start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  instance = lenis;
  instance.__dispose = () => {
    unbindAnchors();
    document.removeEventListener('visibilitychange', onVisibility);
    gsap.ticker.remove(tick);
    lenis.destroy();
    instance = null;
  };

  return instance;
}

export function getSmoothScroll() {
  return instance;
}
