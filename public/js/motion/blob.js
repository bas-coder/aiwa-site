/**
 * §4.7 · Animated gradient blob.
 *
 * A continuously morphing ring with a hollow centre and a rotating multi-colour
 * radial fill, used as a section background.
 *
 * Every parameter below is from the spec's table:
 *   16 contour points per ring · Catmull-Rom converted to cubic Béziers, closed
 *   9000ms cycle · hole via a second sub-path + fill-rule="evenodd"
 *   gradient rotates +360° over one cycle · 5 brand colours
 *
 * Each ring radius is three summed sine waves. THE WAVE SPEEDS MUST BE
 * INTEGERS or the loop does not close - at t=1 every term has to come back to
 * its t=0 value, and only whole numbers of turns do that. A speed of 1.5 leaves
 * a visible seam once every nine seconds, which is exactly long enough that
 * nobody catches it in review and everybody feels it on the live site.
 *
 * Guards, all of them required: >=480px only, static frame under reduced
 * motion, IntersectionObserver pause, visibilitychange pause. Plus a random
 * starting phase per instance so two blobs on one page never beat in sync, and
 * uniquified gradient ids so they do not share one <defs>.
 */

import { prefersReducedMotion } from './tokens.js';

const WAVES = {
  outer: [
    { amp: 0.075, freq: 3, speed: 1 },
    { amp: 0.050, freq: 5, speed: -2 },
    { amp: 0.030, freq: 2, speed: 2 },
  ],
  inner: [
    { amp: 0.090, freq: 4, speed: -1 },
    { amp: 0.060, freq: 2, speed: 2 },
    { amp: 0.035, freq: 6, speed: 1 },
  ],
};

const POINTS = 16;
const CYCLE = 9000;
const PALETTE = ['--stop-1', '--stop-2', '--stop-3', '--stop-4', '--stop-5'];

let uid = 0;

/** Catmull-Rom through a closed point list, emitted as cubic Béziers. */
function closedSpline(pts) {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + ' Z';
}

function ring(cx, cy, base, waves, t, phase) {
  const pts = [];
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2;
    let r = 1;
    for (const w of waves) {
      r += w.amp * Math.sin(w.freq * a + w.speed * Math.PI * 2 * t + phase);
    }
    r *= base;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

export function blobs(root = document) {
  const nodes = [...root.querySelectorAll('[data-blob]')];
  if (!nodes.length) return () => {};

  const css = getComputedStyle(document.documentElement);
  const colours = PALETTE.map((v) => css.getPropertyValue(v).trim() || '#fea002');
  const small = window.matchMedia('(max-width: 479px)').matches;
  const reduced = prefersReducedMotion();

  const instances = nodes.map((svg) => {
    const id = `blob-grad-${++uid}`;   // per-instance or they all share one
    const phase = Math.random() * Math.PI * 2;

    svg.innerHTML = `
      <defs>
        <radialGradient id="${id}" cx="50%" cy="50%" r="62%" gradientUnits="objectBoundingBox">
          ${colours.map((c, i) => `<stop offset="${(i / (colours.length - 1)).toFixed(3)}" stop-color="${c}" stop-opacity="${(0.5 - i * 0.09).toFixed(2)}"/>`).join('')}
        </radialGradient>
        <filter id="${id}-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="17" />
        </filter>
      </defs>
      <g filter="url(#${id}-soft)">
        <path fill="url(#${id})" fill-rule="evenodd" />
      </g>`;

    return {
      svg,
      path: svg.querySelector('path'),
      grad: svg.querySelector('radialGradient'),
      phase,
      visible: false,
    };
  });

  const render = (inst, t) => {
    const outer = ring(200, 200, 150, WAVES.outer, t, inst.phase);
    const inner = ring(200, 200, 74, WAVES.inner, t, inst.phase);
    // two sub-paths + evenodd = a hollow centre
    inst.path.setAttribute('d', `${closedSpline(outer)} ${closedSpline(inner)}`);
    inst.grad.setAttribute('gradientTransform', `rotate(${(t * 360).toFixed(1)} 0.5 0.5)`);
  };

  /* <480px or reduced motion: draw one frame and stop. The section still has
     its background; it just does not breathe. */
  if (small || reduced) {
    instances.forEach((i) => render(i, 0));
    return () => nodes.forEach((n) => { n.innerHTML = ''; });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const inst = instances.find((i) => i.svg === e.target);
      if (inst) inst.visible = e.isIntersecting;
    });
  }, { threshold: 0 });
  instances.forEach((i) => io.observe(i.svg));

  let raf = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (document.hidden) return;
    const t = (now % CYCLE) / CYCLE;
    for (const inst of instances) if (inst.visible) render(inst, t);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    nodes.forEach((n) => { n.innerHTML = ''; });
  };
}
