/**
 * The loader.
 *
 * Its real job is to cover the gap between first paint and fonts.ready, so the
 * hero headline never flashes unstyled (§2.2, and the first two lines of the
 * §6 QA list). Everything visual about it is in service of that.
 *
 * Shown ONCE PER SESSION. A loader on every navigation is a tax on the people
 * who use the site most; sessionStorage is the same gate the moto-card build
 * uses and it is the right one.
 *
 * The mark is the app's own logo lockup (the same one apps/web boots with),
 * not a typeset wordmark, so the lander and the app open on the same image.
 * An image can't do the H1's three-pass character build, so it gets that
 * build's shape instead - blur off, scale settling, one continuous ease over
 * the same window - and the hero entrance still lands as a continuation.
 */

import { EASE, DUR, STAGGER, prefersReducedMotion } from './tokens.js';

const KEY = 'aiwa_loader_seen';

const forceShow = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.has('loader') || window.location.hash === '#loader';
  } catch {
    return false;
  }
};

const seen = () => {
  if (forceShow()) return false;
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
};
const markSeen = () => {
  if (forceShow()) return;
  try { sessionStorage.setItem(KEY, '1'); } catch { /* private mode; show it again */ }
};

export function runLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return Promise.resolve();

  const remove = () => loader.remove();

  if (seen() || prefersReducedMotion()) {
    remove();
    return Promise.resolve();
  }
  markSeen();

  const mark = loader.querySelector('.loader__mark img');
  const stages = [...loader.querySelectorAll('[data-loader-stage]')];
  const rail = loader.querySelector('.loader__rail i');

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      defaults: { ease: EASE.primary },
      onComplete: () => { remove(); resolve(); },
    });

    // the logo resolves out of the blur over the same ~0.68s the three
    // character passes used to take, so the beat the stages tick against is
    // unchanged
    tl.fromTo(
      mark,
      { opacity: 0, scale: 0.94, filter: 'blur(14px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.68, ease: EASE.enter },
      0
    );

    // the five stages tick over while the rail fills - the page says what the
    // product does before the page has finished loading
    stages.forEach((s, i) => {
      tl.call(() => {
        stages.forEach((o) => o.classList.remove('is-on'));
        s.classList.add('is-on');
      }, null, 0.35 + i * 0.16);
    });

    tl.to(rail, { width: '100%', duration: 1.1, ease: EASE.scrub }, 0.2);

    tl.to(loader, {
      autoAlpha: 0,
      scale: 1.06,
      duration: 0.7,
      ease: EASE.soft,
      transformOrigin: 'center center',
    }, '>-0.1');
  });
}
