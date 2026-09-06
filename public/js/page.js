/**
 * Boot, for every page that is not the home page.
 *
 * The home page's main.js builds a scrubbed hero, a pinned horizontal track and
 * a Flip-style handoff, and pays for them: SplitText, a 400vh pin, a rebuild
 * contract keyed to viewport width. A legal document needs none of that, and
 * loading it anyway is not free - normalizeScroll and a pin that has nothing to
 * pin are both cost with no picture attached.
 *
 * So this is the same primitives, minus the hero. Every builder imported here
 * is one of the shared ones from motion/, NOT a copy: a fix to blurReveal has
 * to land on thirteen pages at once, and it can only do that if there is one
 * blurReveal.
 *
 * The rebuild contract is main.js's, for main.js's reason (§2.6): a width
 * resize kills and rebuilds, a height-only resize is the URL bar collapsing and
 * is ignored. Nothing on a page is pinned, so the stakes are lower here - but
 * the marquee durations ARE measured from element width, so a rebuild is still
 * how a resized page gets its speed right.
 */

import { blurReveal, gradientText, marquees, springHovers } from './motion/primitives.js';
import { blobs } from './motion/blob.js';
import { accordion, footerReveal, navState, navMenu } from './motion/sections.js';
import { prefersReducedMotion } from './motion/tokens.js';
import { initRefreshQueue } from './motion/scroll.js';

gsap.registerPlugin(ScrollTrigger);

/* Same reason as main.js: mobile browser chrome collapsing on scroll changes
   innerHeight constantly, and a refresh on every one of those is a jank source
   for no gain. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* §5.4 - Lenis on Windows only, exactly as main.js argues. A page and the home
   page must not scroll differently; that is felt immediately on a nav click. */
function initLenis() {
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  if (!/win/i.test(platform) || prefersReducedMotion() || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({ duration: 1.1, wheelMultiplier: 1.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

let teardowns = [];
let cachedWidth = window.innerWidth;

function build() {
  teardowns.forEach((fn) => { try { fn(); } catch (e) { console.warn('[teardown]', e); } });
  teardowns = [];

  teardowns.push(blurReveal());
  teardowns.push(gradientText());
  teardowns.push(marquees());
  teardowns.push(blobs());
  teardowns.push(springHovers());
  teardowns.push(accordion());
  teardowns.push(footerReveal());
  teardowns.push(navState());
  teardowns.push(navMenu());

  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth === cachedWidth) return;   // height-only: the URL bar
    cachedWidth = window.innerWidth;
    build();
  }, 200);
}, { passive: true });

/**
 * The one behaviour a document has that the home page does not: mark the .toc
 * entry for the section you are reading.
 *
 * IntersectionObserver, not a scroll handler, and the rootMargin is what makes
 * it correct rather than approximately correct: the top inset clears the fixed
 * nav so a heading is "current" when it is readable rather than when it is
 * behind the nav bar, and the -70% bottom inset means only headings in the top
 * third of the viewport compete, so a long section stays current while you read
 * it instead of handing off to the next heading the moment it peeks in.
 */
function tocSync() {
  const toc = document.querySelector('[data-toc]');
  if (!toc) return () => {};

  const links = new Map(
    [...toc.querySelectorAll('a[href^="#"]')].map((a) => [decodeURIComponent(a.hash.slice(1)), a])
  );
  const headings = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!headings.length) return () => {};

  let current = null;
  const setCurrent = (id) => {
    if (id === current) return;
    if (current) links.get(current)?.removeAttribute('aria-current');
    current = id;
    if (current) links.get(current)?.setAttribute('aria-current', 'true');
  };

  const seen = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id); });
    // Document order, so scrolling up lands on the earliest visible heading
    // rather than whichever entry the callback happened to report last.
    const first = headings.find((h) => seen.has(h.id));
    if (first) setCurrent(first.id);
  }, { rootMargin: `-${Math.round(document.querySelector('.nav')?.offsetHeight ?? 72) + 16}px 0px -70% 0px` });

  headings.forEach((h) => io.observe(h));
  return () => io.disconnect();
}

function start() {
  initLenis();
  initRefreshQueue();
  build();
  tocSync();
}

if (document.readyState === 'complete') start();
else window.addEventListener('load', start);
