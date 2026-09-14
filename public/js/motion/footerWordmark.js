/**
 * Footer wordmark FX — grain / warp filter + cursor-driven heat.
 * Shared by home (main.js) and subpages (page.js).
 */

import { prefersReducedMotion } from './tokens.js';

const FILTER_ID = 'fw-wordmark-fx';
const IDLE_AMP = 0.22;
const HOVER_AMP = 1;
const LEAVE_AMP = 0.12;
const LERP = 0.14;
const HEAT_LERP = 0.18;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function ensureFilterDefs() {
  if (document.getElementById(FILTER_ID)) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('fw-fx-defs');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `
    <defs>
      <filter id="${FILTER_ID}" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="noise"/>
        <feColorMatrix in="noise" type="saturate" values="0" result="mono"/>
        <feComponentTransfer in="mono" result="grain">
          <feFuncA type="linear" slope="0.22" intercept="0"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="grain" mode="soft-light" result="grained"/>
        <feTurbulence type="turbulence" baseFrequency="0.015 0.45" numOctaves="2" seed="7" result="warp"/>
        <feDisplacementMap in="grained" in2="warp" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="sorted"/>
        <feComponentTransfer in="sorted">
          <feFuncR type="discrete" tableValues="0 0.08 0.16 0.24 0.32 0.4 0.48 0.56 0.64 0.72 0.8 0.88 0.96 1"/>
          <feFuncG type="discrete" tableValues="0 0.08 0.16 0.24 0.32 0.4 0.48 0.56 0.64 0.72 0.8 0.88 0.96 1"/>
          <feFuncB type="discrete" tableValues="0 0.08 0.16 0.24 0.32 0.4 0.48 0.56 0.64 0.72 0.8 0.88 0.96 1"/>
        </feComponentTransfer>
      </filter>
    </defs>
  `;
  document.body.prepend(svg);
}

export function footerWordmark() {
  const footer = document.querySelector('[data-footer]');
  const crop = footer?.querySelector('.footer__wordmark-crop');
  const mark = crop?.querySelector('.footer__wordmark');
  if (!footer || !crop || !mark) return () => {};

  ensureFilterDefs();
  mark.style.filter = `url(#${FILTER_ID})`;
  crop.classList.add('is-fx');

  if (prefersReducedMotion()) {
    footer.style.setProperty('--fw-amp', '0.28');
    footer.style.setProperty('--fw-px', '50%');
    footer.style.setProperty('--fw-py', '42%');
    return () => {
      mark.style.filter = '';
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
  if (footer.classList.contains('is-in') || prefersReducedMotion()) {
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
    mark.style.filter = '';
    crop.classList.remove('is-fx');
    footer.style.removeProperty('--fw-amp');
    footer.style.removeProperty('--fw-px');
    footer.style.removeProperty('--fw-py');
  };
}
