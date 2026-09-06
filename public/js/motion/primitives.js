/**
 * Reusable motion primitives - spec §4.1, §4.2, §4.3, §4.6.
 *
 * Every builder in here returns a teardown function (§5.2). Nothing registers
 * a listener, a ScrollTrigger or a rAF loop it cannot take back, because the
 * matchMedia branches in main.js will call these teardowns on every breakpoint
 * crossing and a leaked trigger there is what locks the page up on resize.
 */

import { EASE, DUR, STAGGER, REVEAL, prefersReducedMotion, withWillChange } from './tokens.js';

/* ===========================================================================
   §4.1 · Blur-reveal on scroll - the workhorse.
   Two APIs: data-blur-in (single) and data-blur-parent/data-blur-child (group).
   Overrides: data-distance, data-start, data-stagger (in MILLISECONDS).
   ======================================================================== */
export function blurReveal(root = document) {
  const HIDDEN = { autoAlpha: 0, filter: `blur(${REVEAL.blur}px)`, y: REVEAL.y };
  const triggers = [];

  /* Reduced motion: clear the props and leave. The elements just exist. */
  if (prefersReducedMotion()) {
    root.querySelectorAll('[data-blur-in], [data-blur-child]')
      .forEach((el) => el.classList.add('is-revealed'));
    return () => {};
  }

  const build = (trigger, targets, el) => {
    /* A width resize rebuilds everything. Anything already revealed stays
       revealed - re-hiding content the visitor is currently looking at, then
       replaying it, is the classic resize-flicker. */
    targets = targets.filter((t) => !t.classList.contains('is-revealed'));
    if (!targets.length) return;
    const distance = el.dataset.distance || REVEAL.y;
    const start = el.dataset.start || 'top 80%';
    const stagger = el.dataset.stagger ? Number(el.dataset.stagger) / 1000 : STAGGER.item;

    gsap.set(targets, { ...HIDDEN, y: distance });

    /* §5.3 - will-change goes on at onEnter and comes off 500ms after the
       tween settles. `clearWillChange` MUST be declared before the gsap.to
       call: when an element is already past its start (a deep link, a restored
       scroll position, a rebuild after resize) ScrollTrigger fires onEnter
       SYNCHRONOUSLY during creation. Referencing a `let` declared below that
       call throws a TDZ ReferenceError from inside the callback, which aborts
       the rest of this function - every later reveal on the page then stays
       stuck at opacity 0. */
    let clearWillChange = () => {};

    const tl = gsap.to(targets, {
      autoAlpha: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: DUR.reveal,
      ease: EASE.soft,
      stagger,
      clearProps: 'all',   // leave no inline styles behind
      onComplete: () => {
        // Must outlive clearProps - see the .is-revealed note in base.css.
        targets.forEach((el) => el.classList.add('is-revealed'));
        clearWillChange();
      },
      scrollTrigger: {
        trigger,
        start,
        once: true,
        onEnter: () => { clearWillChange = withWillChange(targets, 'opacity, filter, transform'); },
      },
    });
    triggers.push(tl);
  };

  [...root.querySelectorAll('[data-blur-in]')].forEach((el) => build(el, [el], el));

  [...root.querySelectorAll('[data-blur-parent]')].forEach((parent) => {
    const kids = [...parent.querySelectorAll('[data-blur-child]')]
      .filter((k) => k.dataset.ignore !== 'true');
    build(parent, kids, parent);
  });

  return () => {
    triggers.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    /* A rebuild must not re-hide what the visitor has already seen, so
       .is-revealed is deliberately NOT removed here. Only the inline
       leftovers of an in-flight tween are cleared. */
    gsap.set(root.querySelectorAll('[data-blur-in]:not(.is-revealed), [data-blur-child]:not(.is-revealed)'), { clearProps: 'all' });
  };
}

/* ===========================================================================
   §4.2 · Gradient text sweep. The gradient lives in CSS; this only moves it.
   ======================================================================== */
export function gradientText(root = document) {
  const els = [...root.querySelectorAll('[data-grad]')];
  if (!els.length) return () => {};

  if (prefersReducedMotion()) {
    // Jump straight to the end position - the words must stay legible.
    els.forEach((el) => { el.style.backgroundPosition = '0% 50%'; });
    return () => {};
  }

  const tweens = els.map((el) =>
    gsap.to(el, {
      backgroundPosition: '0% 50%',
      duration: DUR.gradientText,
      ease: EASE.enter,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  );

  return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
}

/* ===========================================================================
   §4.3 · Marquee.
   Duration is COMPUTED from measured width so speed is constant regardless of
   item count - never hardcoded. Paused off-screen via IntersectionObserver.
   ======================================================================== */
export function marquees(root = document) {
  const nodes = [...root.querySelectorAll('[data-marquee]')];
  if (!nodes.length) return () => {};

  const cleanups = [];

  nodes.forEach((node) => {
    const track = node.querySelector('.marquee__track');
    const group = track?.querySelector('.marquee__group');
    if (!track || !group) return;

    // Clone the group once so translateX(-50%) lands on an identical frame.
    if (track.children.length === 1) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    const speed = Number(node.dataset.speed) || 30; // px/s
    const measure = () => {
      const width = group.getBoundingClientRect().width;
      if (!width) return;
      track.style.animationDuration = `${width / speed}s`;
    };

    // Images load after first paint and change the width, so re-measure.
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(group);

    if (prefersReducedMotion()) {
      track.style.animation = 'none';
      cleanups.push(() => ro.disconnect());
      return;
    }

    track.style.animationPlayState = 'paused';
    const io = new IntersectionObserver(
      ([entry]) => { track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'; },
      { threshold: 0 }
    );
    io.observe(node);

    // Background tabs should not burn a compositor thread either.
    const onVisibility = () => {
      if (document.hidden) track.style.animationPlayState = 'paused';
    };
    document.addEventListener('visibilitychange', onVisibility);

    cleanups.push(() => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      track.style.animation = '';
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* ===========================================================================
   §4.6 · Hover springs.
   Critically-damped spring, stepped per rAF frame. This is why the reference's
   card hovers feel physical instead of animated - a tween has a fixed
   duration, so interrupting one mid-flight visibly restarts it. A spring just
   changes target and keeps its velocity.
   ======================================================================== */
export function spring(state, target, dt, stiffness = 14, damping = 0.55) {
  const s = 1 + 2 * dt * damping * stiffness;
  const i = dt * (stiffness * stiffness);
  const c = dt * i;
  const inv = 1 / (s + c);
  const next = (s * state.x + dt * state.v + c * target) * inv;
  state.v = (state.v + i * (target - state.x)) * inv;
  state.x = next;
  return state.x;
}

/** Exponential smoothing - good enough for opacity and position. */
export const lerp = (from, to, rate, dt) => from + (to - from) * (1 - Math.exp(-rate * dt));

/**
 * Wires [data-spring] elements to a shared rAF loop that springs scale toward
 * --scale-hover on hover. One loop for every card, not one per card.
 */
export function springHovers(root = document) {
  const cards = [...root.querySelectorAll('[data-spring]')];
  if (!cards.length || prefersReducedMotion()) return () => {};
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};

  const items = cards.map((el) => ({ el, state: { x: 1, v: 0 }, target: 1, live: false }));
  const listeners = [];

  items.forEach((item) => {
    const enter = () => { item.target = 1.05; item.live = true; item.el.style.willChange = 'transform'; };
    const leave = () => { item.target = 1; };
    item.el.addEventListener('pointerenter', enter);
    item.el.addEventListener('pointerleave', leave);
    listeners.push(() => {
      item.el.removeEventListener('pointerenter', enter);
      item.el.removeEventListener('pointerleave', leave);
    });
  });

  let last = performance.now();
  let raf = 0;
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    for (const item of items) {
      if (!item.live) continue;
      const s = spring(item.state, item.target, dt);
      item.el.style.transform = `scale(${s})`;
      // settled and back at rest - stop touching this node entirely
      if (item.target === 1 && Math.abs(s - 1) < 0.0005 && Math.abs(item.state.v) < 0.002) {
        item.live = false;
        item.state.x = 1; item.state.v = 0;
        item.el.style.transform = '';
        item.el.style.willChange = '';
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    listeners.forEach((fn) => fn());
    items.forEach(({ el }) => { el.style.transform = ''; el.style.willChange = ''; });
  };
}

/**
 * The cursor-following specular highlight on the glass panels (§4.5, the
 * cheap-and-good version). Feeds --mx/--my; CSS draws the radial gradient.
 */
export function glassHighlights(root = document) {
  const panels = [...root.querySelectorAll('.stage-panel__glass')];
  if (!panels.length) return () => {};
  const off = panels.map((el) => {
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  });
  return () => off.forEach((fn) => fn());
}
