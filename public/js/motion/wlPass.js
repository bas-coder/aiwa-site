/**
 * White Label hang-tag
 * Idle pendulum, pointer tilt, amber heat chase,
 * grab → ease toward pointer → release with spring-back.
 * Root: [data-wl-swing="pass"]
 */

import { prefersReducedMotion } from './tokens.js';

const GRAVITY = 18;
const DAMPING = 0.992;
const SPRING = 14;
const GRAB_FOLLOW = 12;
const DRAG_THRESHOLD_PX = 8;
const IDLE_SEED = 0.35;
const VELOCITY_MAX = 2.2;
const VELOCITY_SMOOTH = 0.55;

const PASS = {
  maxAngle: 0.28,
  tiltGain: 10,
  length: 1,
  dragReach: 240,
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function finePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function attachSwing(root) {
  const cfg = PASS;
  const card = root.querySelector('.wl-pass__card');
  const heatHost = root.closest('.wl-pass__stage');
  const stage = root.parentElement;

  let angle = (Math.random() * 2 - 1) * IDLE_SEED * 0.04;
  let velocity = 0;
  let targetAngle = angle;
  let tiltX = 0;
  let tiltY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;
  let mx = 50;
  let my = 28;
  let targetMx = 50;
  let targetMy = 28;
  let dragging = false;
  let dragArmed = false;
  let pointerId = null;
  let startX = 0;
  let lastT = 0;
  let lastDragT = 0;
  let pivotX = 0;
  let inView = true;
  let raf = 0;
  let live = false;

  const setWillChange = (on) => {
    root.style.willChange = on ? 'transform' : '';
    if (card) card.style.willChange = on ? 'transform' : '';
  };

  const setDraggingClass = (on) => {
    root.classList.toggle('is-dragging', on);
  };

  const paint = () => {
    const deg = (angle * 180) / Math.PI;
    root.style.transform = `rotateZ(${deg}deg)`;
    root.style.setProperty('--wl-swing', String(deg));
    if (card) {
      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
    if (heatHost) {
      heatHost.style.setProperty('--mx', `${mx}%`);
      heatHost.style.setProperty('--my', `${my}%`);
    }
  };

  /* Layout geometry only — ignore CSS transforms / 3D child tilt, which make
     getBoundingClientRect() jitter and fight the drag mapping. */
  const refreshPivotX = () => {
    if (!stage) {
      pivotX = root.getBoundingClientRect().left + root.offsetWidth / 2;
      return;
    }
    const stageRect = stage.getBoundingClientRect();
    pivotX = stageRect.left + root.offsetLeft + root.offsetWidth / 2;
  };

  /* Map pointer X to hang angle. Negated so drag-right swings the tag right
     under transform-origin: top center. */
  const angleFromPointerX = (clientX) => {
    const dx = clientX - pivotX;
    return clamp(-dx / cfg.dragReach, -cfg.maxAngle, cfg.maxAngle);
  };

  const step = (now) => {
    if (!live) return;
    const dt = Math.min(0.033, (now - lastT) / 1000 || 0.016);
    lastT = now;

    if (dragging) {
      const prev = angle;
      angle += (targetAngle - angle) * Math.min(1, dt * GRAB_FOLLOW);
      const sample = (angle - prev) / dt;
      velocity = velocity * (1 - VELOCITY_SMOOTH) + sample * VELOCITY_SMOOTH;
    } else {
      const accel = -GRAVITY * Math.sin(angle) * cfg.length;
      velocity += accel * dt;
      velocity *= Math.pow(DAMPING, dt * 60);
      angle += velocity * dt;
      if (angle < -cfg.maxAngle || angle > cfg.maxAngle) {
        angle = clamp(angle, -cfg.maxAngle, cfg.maxAngle);
        velocity *= 0.2;
      }
    }

    if (finePointer()) {
      tiltX += (targetTiltX - tiltX) * Math.min(1, dt * SPRING);
      tiltY += (targetTiltY - tiltY) * Math.min(1, dt * SPRING);
      mx += (targetMx - mx) * Math.min(1, dt * 10);
      my += (targetMy - my) * Math.min(1, dt * 10);
    }

    paint();
    raf = requestAnimationFrame(step);
  };

  const startLoop = () => {
    if (live || document.hidden || !inView) return;
    live = true;
    setWillChange(true);
    lastT = performance.now();
    raf = requestAnimationFrame(step);
  };

  const stopLoop = () => {
    live = false;
    cancelAnimationFrame(raf);
    setWillChange(false);
  };

  const onPointerMove = (event) => {
    if (!finePointer() || dragging) return;
    const r = root.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const nx = (event.clientX - r.left) / r.width;
    const ny = (event.clientY - r.top) / r.height;
    targetTiltY = (nx - 0.5) * cfg.tiltGain * 2;
    targetTiltX = (0.5 - ny) * cfg.tiltGain * 1.4;
    targetMx = clamp(nx * 100, 8, 92);
    targetMy = clamp(ny * 100, 8, 92);
    startLoop();
  };

  const onPointerLeave = () => {
    if (dragging) return;
    targetTiltX = 0;
    targetTiltY = 0;
    targetMx = 50;
    targetMy = 28;
  };

  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return;
    dragArmed = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    refreshPivotX();
    lastDragT = performance.now();
    root.setPointerCapture?.(pointerId);
  };

  const onPointerDrag = (event) => {
    if (!dragArmed || event.pointerId !== pointerId) return;
    const dxFromStart = event.clientX - startX;
    if (!dragging) {
      if (Math.abs(dxFromStart) < DRAG_THRESHOLD_PX) return;
      dragging = true;
      setDraggingClass(true);
      velocity = 0;
      /* Flat the card while grabbing so 3D tilt can't skew hit-testing. */
      targetTiltX = 0;
      targetTiltY = 0;
      tiltX = 0;
      tiltY = 0;
      refreshPivotX();
      /* Leave current angle; ease toward pointer target in step(). */
      targetAngle = angleFromPointerX(event.clientX);
      startLoop();
      return;
    }

    targetAngle = angleFromPointerX(event.clientX);
    lastDragT = performance.now();
  };

  const onPointerUp = (event) => {
    if (event.pointerId !== pointerId) return;
    const wasDragging = dragging;
    dragArmed = false;
    dragging = false;
    setDraggingClass(false);
    pointerId = null;
    try { root.releasePointerCapture?.(event.pointerId); } catch { /* already released */ }
    if (wasDragging) {
      velocity = clamp(velocity, -VELOCITY_MAX, VELOCITY_MAX);
    }
    startLoop();
  };

  const onResize = () => {
    refreshPivotX();
  };

  const io = new IntersectionObserver(([entry]) => {
    inView = Boolean(entry?.isIntersecting);
    if (inView) {
      refreshPivotX();
      startLoop();
    } else stopLoop();
  }, { threshold: 0.12 });

  const onVisibility = () => {
    if (document.hidden) stopLoop();
    else if (inView) startLoop();
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerDrag);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  io.observe(root);
  refreshPivotX();
  paint();
  startLoop();

  return () => {
    stopLoop();
    setDraggingClass(false);
    io.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    root.removeEventListener('pointerdown', onPointerDown);
    root.removeEventListener('pointermove', onPointerDrag);
    root.removeEventListener('pointerup', onPointerUp);
    root.removeEventListener('pointercancel', onPointerUp);
    root.removeEventListener('pointermove', onPointerMove);
    root.removeEventListener('pointerleave', onPointerLeave);
    root.style.transform = '';
    root.style.removeProperty('--wl-swing');
    if (card) card.style.transform = '';
  };
}

export function wlPass() {
  const roots = [...document.querySelectorAll('[data-wl-swing="pass"]')];
  if (!roots.length) return () => {};

  if (prefersReducedMotion()) {
    return () => {};
  }

  const cleanups = roots.map((root) => attachSwing(root));
  return () => cleanups.forEach((fn) => fn());
}
