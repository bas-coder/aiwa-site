/**
 * Footer wordmark FX — cursor heat + plus/grain film overlays.
 * No SVG filter on the <img>: filters turn transparent SVG pixels opaque
 * and paint a filled plate behind the glyphs.
 * Shared by home (main.js) and subpages (page.js).
 */

import { prefersReducedMotion } from './tokens.js';

const IDLE_AMP = 0.22;
const HOVER_AMP = 1;
const LEAVE_AMP = 0.12;
const LERP = 0.14;
const HEAT_LERP = 0.18;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function footerWordmark() {
  const footer = document.querySelector('[data-footer]');
  const crop = footer?.querySelector('.footer__wordmark-crop');
  const mark = crop?.querySelector('.footer__wordmark');
  if (!footer || !crop || !mark) return () => {};

  crop.classList.add('is-fx');

  if (prefersReducedMotion()) {
    footer.style.setProperty('--fw-amp', '0.28');
    footer.style.setProperty('--fw-px', '50%');
    footer.style.setProperty('--fw-py', '42%');
    return () => {
      crop.classList.remove('is-fx');
    };
  }

  let amp = IDLE_AMP;
  let px = 50;
  let py = 42;
  let targetAmp = IDLE_AMP;
  let targetPx = 50;
  let targetPy = 42;
  let hovering = false;
  let raf = 0;
  let live = false;

  const paint = () => {
    footer.style.setProperty('--fw-amp', String(amp));
    footer.style.setProperty('--fw-px', `${px}%`);
    footer.style.setProperty('--fw-py', `${py}%`);
  };

  const tick = () => {
    amp += (targetAmp - amp) * LERP;
    px += (targetPx - px) * HEAT_LERP;
    py += (targetPy - py) * HEAT_LERP;
    paint();
    const settled =
      Math.abs(targetAmp - amp) < 0.002
      && Math.abs(targetPx - px) < 0.05
      && Math.abs(targetPy - py) < 0.05;
    if (settled && !hovering) {
      live = false;
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (live) return;
    live = true;
    raf = requestAnimationFrame(tick);
  };

  const onMove = (event) => {
    const r = crop.getBoundingClientRect();
    if (!r.width || !r.height) return;
    hovering = true;
    targetAmp = HOVER_AMP;
    targetPx = clamp(((event.clientX - r.left) / r.width) * 100, 4, 96);
    targetPy = clamp(((event.clientY - r.top) / r.height) * 100, 8, 92);
    start();
  };

  const onEnter = () => {
    hovering = true;
    targetAmp = HOVER_AMP;
    start();
  };

  const onLeave = () => {
    hovering = false;
    targetAmp = LEAVE_AMP;
    targetPx = 50;
    targetPy = 42;
    start();
  };

  /* Plate is the hit area so heat works before the cursor is exactly on glyphs. */
  const plate = footer.querySelector('.footer__plate') || footer;
  plate.addEventListener('pointermove', onMove);
  plate.addEventListener('pointerenter', onEnter);
  plate.addEventListener('pointerleave', onLeave);

  /* Idle glow once the footer has revealed. */
  const syncIdle = () => {
    if (!footer.classList.contains('is-in')) return;
    if (!hovering) {
      targetAmp = IDLE_AMP;
      start();
    }
  };
  const mo = new MutationObserver(syncIdle);
  mo.observe(footer, { attributes: true, attributeFilter: ['class'] });
  if (footer.classList.contains('is-in')) {
    targetAmp = IDLE_AMP;
    paint();
    start();
  } else {
    paint();
  }

  return () => {
    cancelAnimationFrame(raf);
    mo.disconnect();
    plate.removeEventListener('pointermove', onMove);
    plate.removeEventListener('pointerenter', onEnter);
    plate.removeEventListener('pointerleave', onLeave);
    crop.classList.remove('is-fx');
    footer.style.removeProperty('--fw-amp');
    footer.style.removeProperty('--fw-px');
    footer.style.removeProperty('--fw-py');
  };
}
