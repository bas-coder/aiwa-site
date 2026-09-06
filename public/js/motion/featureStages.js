/**
 * Why AIWA - coded product stages.
 *
 * Each card rebuilds a real surface from app.aiwa.codes and loops a short
 * sequence. A pointer drives the clicks (chip, send, Preview, a project row).
 * Timing is tokens only. Off-screen stages pause. Reduced motion keeps the
 * designed static chrome (full text, preview shown, no pointer, no loop).
 */

import { EASE, DUR, STAGGER, prefersReducedMotion, cssVar, pageVisible } from './tokens.js';

const ARCHITECT_PROMPT = 'Ask AIWA to build a personal blog';
const followAt = 1 - STAGGER.overlap;

const stageY = () => cssVar('--stage-y') || '0.5rem';
const homeX = () => cssVar('--cursor-home-x') || '1.15rem';
const homeY = () => cssVar('--cursor-home-y') || '1.35rem';
const hidden = () => ({ autoAlpha: 0, y: stageY() });
const shown = { autoAlpha: 1, y: 0 };

function numVar(name, fallback) {
  const n = Number.parseFloat(cssVar(name));
  return Number.isFinite(n) ? n : fallback;
}

function typeText(el, text, tl, at) {
  const chars = [...text];
  tl.set(el, { textContent: '' }, at);
  chars.forEach((ch, i) => {
    tl.add(() => { el.textContent += ch; }, at + i * DUR.typeChar);
  });
  return chars.length * DUR.typeChar;
}

/**
 * A stage plays whenever it is on screen, full stop.
 *
 * It used to wait for a pointerenter on hover-capable devices (touch already
 * behaved this way), which meant a visitor who scrolled to this section on a
 * laptop met four frozen cards and had to go looking for the animation. The
 * section is the trigger now, not the pointer.
 *
 * The two pauses are kept, and they are not decoration: four looping timelines
 * driving a fake cursor is real work, and there is no reason to spend it on a
 * card that is off-screen or a tab nobody is looking at. Each builder already
 * calls its own reset() at position 0, so a loop that resumes after a pause
 * re-enters from a clean state on its next pass.
 */
function playWhenVisible(node, tl) {
  tl.timeScale(numVar('--stage-pace', 0.72));
  tl.pause(0);
  let onScreen = false;
  const io = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && pageVisible()) tl.play();
      else tl.pause();
    },
    { threshold: 0.25 },
  );
  io.observe(node);
  const onVis = () => {
    if (document.hidden) tl.pause();
    else if (onScreen) tl.play();
  };
  document.addEventListener('visibilitychange', onVis);
  return () => {
    io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    tl.kill();
  };
}

function pointIn(root, el, cursor) {
  const r = root.getBoundingClientRect();
  const t = el.getBoundingClientRect();
  const c = cursor?.getBoundingClientRect();
  const ox = (c?.width || 0) * numVar('--cursor-origin-x', 0.12);
  const oy = (c?.height || 0) * numVar('--cursor-origin-y', 0.08);
  return {
    x: t.left - r.left + t.width * numVar('--cursor-aim-x', 0.62) - ox,
    y: t.top - r.top + t.height * numVar('--cursor-aim-y', 0.55) - oy,
  };
}

function travelDur(from, to) {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const ref = numVar('--cursor-ref', 140);
  const scaled = DUR.cursorTravel * Math.sqrt(Math.max(dist, 1) / ref);
  const min = DUR.cursorPress + DUR.cursorDwell;
  const max = DUR.cursorTravelMax;
  return gsap.utils.clamp(min, max, scaled);
}

const lastPos = new WeakMap();

function cursorXY(cursor) {
  return {
    x: Number(gsap.getProperty(cursor, 'x', 'px')) || 0,
    y: Number(gsap.getProperty(cursor, 'y', 'px')) || 0,
  };
}

function parkCursor(cursor) {
  if (!cursor) return;
  cursor.classList.remove('is-click');
  gsap.set(cursor, { x: homeX(), y: homeY(), autoAlpha: 0, scale: 1 });
  lastPos.set(cursor, cursorXY(cursor));
}

function revealCursor(tl, cursor, at) {
  if (!cursor) return at;
  tl.to(cursor, { autoAlpha: 1, duration: DUR.cursorPress, ease: EASE.enter }, at);
  return at + DUR.cursorPress;
}

function aim(tl, cursor, root, target, at) {
  if (!cursor || !target) return at;
  const to = pointIn(root, target, cursor);
  const from = lastPos.get(cursor) || cursorXY(cursor);
  const dur = travelDur(from, to);
  lastPos.set(cursor, to);
  tl.to(cursor, {
    duration: dur,
    ease: EASE.enter,
    x: () => pointIn(root, target, cursor).x,
    y: () => pointIn(root, target, cursor).y,
  }, at);
  tl.add(() => { target.classList.add('is-hot'); }, at + dur);
  return at + dur;
}

function setZoomOrigin(stage, target) {
  if (!stage || !target) return;
  const sr = stage.getBoundingClientRect();
  const tr = target.getBoundingClientRect();
  if (!sr.width || !sr.height) return;
  const ox = ((tr.left + tr.width / 2) - sr.left) / sr.width * 100;
  const oy = ((tr.top + tr.height / 2) - sr.top) / sr.height * 100;
  gsap.set(stage, { transformOrigin: `${ox}% ${oy}%` });
}

function click(tl, cursor, target, at, latch = true, stage = null) {
  if (!cursor) return at;
  const press = DUR.cursorPress;
  const scale = numVar('--cursor-press-scale', 0.88);
  const pressIn = numVar('--cursor-press-in', 0.45);
  const zoom = numVar('--stage-click-zoom', 1.14);
  let t = at;

  if (stage && target) {
    tl.add(() => setZoomOrigin(stage, target), t);
    tl.to(stage, { scale: zoom, duration: DUR.stageZoom, ease: EASE.enter }, t);
    t += DUR.stageZoom;
  }

  tl.add(() => { cursor.classList.add('is-click'); }, t);
  tl.add(() => { target?.classList.add('is-on'); }, t + press * pressIn);
  tl.to(cursor, { scale, duration: press * pressIn, ease: EASE.enter }, t);
  tl.to(cursor, { scale: 1, duration: press * (1 - pressIn), ease: EASE.enter }, t + press * pressIn);
  tl.add(() => {
    cursor.classList.remove('is-click');
    target?.classList.remove('is-hot');
    if (!latch) target?.classList.remove('is-on');
  }, t + press);
  t += press;

  if (stage) {
    tl.to(stage, { scale: 1, duration: DUR.stageZoomOut, ease: EASE.enter }, t);
    t += DUR.stageZoomOut;
  }
  return t;
}

function restCursor(tl, cursor, at) {
  if (!cursor) return at;
  tl.to(cursor, { autoAlpha: 0, duration: DUR.base, ease: EASE.enter }, at);
  return at + DUR.base;
}

function brain(node) {
  const items = [...node.querySelectorAll('[data-stage-item]')];
  const cursor = node.querySelector('[data-stage-cursor]');
  const plan = node.querySelector('[data-stage-plan]');
  const previewBtn = node.querySelector('[data-stage-preview-btn]');
  const ui = node.querySelector('.stage-ui');
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: DUR.stageHold,
    defaults: { duration: DUR.reveal, ease: EASE.enter },
  });

  const reset = () => {
    gsap.set(items, hidden());
    plan?.classList.remove('is-on', 'is-hot');
    previewBtn?.classList.remove('is-on', 'is-hot');
    parkCursor(cursor);
    if (ui) gsap.set(ui, { scale: 1 });
  };
  reset();
  tl.add(reset, 0);
  tl.to(items, { ...shown, stagger: STAGGER.item }, STAGGER.item);

  let t = revealCursor(tl, cursor, DUR.reveal * followAt + STAGGER.item * items.length);
  t = aim(tl, cursor, node, plan, t);
  t = click(tl, cursor, plan, t + DUR.cursorDwell, true, ui);
  t = aim(tl, cursor, node, previewBtn, t);
  t = click(tl, cursor, previewBtn, t + DUR.cursorDwell, true, ui);
  restCursor(tl, cursor, t);

  return playWhenVisible(node, tl);
}

function architect(node) {
  const typed = node.querySelector('[data-stage-type]');
  const chip = node.querySelector('[data-stage-chip]');
  const send = node.querySelector('[data-stage-send]');
  const cursor = node.querySelector('[data-stage-cursor]');
  const ui = node.querySelector('.stage-ui');
  const items = [...node.querySelectorAll('[data-stage-item]')];
  const full = typed?.dataset.full || typed?.textContent || ARCHITECT_PROMPT;
  if (typed) typed.dataset.full = full;

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: DUR.stageHold,
    defaults: { ease: EASE.enter },
  });

  const reset = () => {
    chip?.classList.remove('is-on', 'is-hot');
    send?.classList.remove('is-on', 'is-hot');
    gsap.set(items, hidden());
    if (typed) typed.textContent = '';
    parkCursor(cursor);
    if (ui) gsap.set(ui, { scale: 1 });
  };
  reset();
  tl.add(reset, 0);

  const typedAt = STAGGER.char;
  const typedDur = typed ? typeText(typed, full, tl, typedAt) : 0;
  let t = revealCursor(tl, cursor, typedAt + typedDur * followAt);
  t = aim(tl, cursor, node, chip, t);
  t = click(tl, cursor, chip, Math.max(t, typedAt + typedDur) + DUR.cursorDwell, true, ui);
  t = aim(tl, cursor, node, send, t);
  t = click(tl, cursor, send, t + DUR.cursorDwell, false, ui);
  tl.to(items, {
    ...shown,
    duration: DUR.entrance,
    stagger: STAGGER.item,
  }, t - DUR.micro);
  restCursor(tl, cursor, t);

  const stop = playWhenVisible(node, tl);
  return () => {
    stop();
    if (typed) typed.textContent = full;
    reset();
  };
}

function preview(node) {
  const ui = node.querySelector('.stage-ui--preview');
  const btn = node.querySelector('[data-stage-preview-btn]');
  const rail = node.querySelector('[data-stage-rail]');
  const deal = node.querySelector('[data-stage-deal]');
  const cursor = node.querySelector('[data-stage-cursor]');
  const items = [...node.querySelectorAll('[data-stage-item]')];
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: DUR.stageHold,
    defaults: { ease: EASE.enter },
  });

  const reset = () => {
    ui?.classList.remove('is-ready');
    btn?.classList.remove('is-on', 'is-hot');
    deal?.classList.remove('is-on', 'is-hot');
    gsap.set(items, hidden());
    if (rail) gsap.set(rail, { scaleX: 0, transformOrigin: 'left center' });
    parkCursor(cursor);
    if (ui) gsap.set(ui, { scale: 1 });
  };
  reset();
  tl.add(reset, 0);

  let t = revealCursor(tl, cursor, STAGGER.item);
  t = aim(tl, cursor, node, btn, t);
  t = click(tl, cursor, btn, t + DUR.cursorDwell, true, ui);
  if (rail) {
    tl.to(rail, {
      scaleX: 1,
      duration: DUR.atmosphere,
      ease: EASE.soft,
    }, t - DUR.micro);
  }
  tl.add(() => { ui?.classList.add('is-ready'); }, t + DUR.atmosphere * followAt);
  tl.to(items, {
    ...shown,
    duration: DUR.entrance,
    stagger: STAGGER.item,
  }, t + DUR.atmosphere * followAt);
  t = t + DUR.atmosphere;
  t = aim(tl, cursor, node, deal, t);
  t = click(tl, cursor, deal, t + DUR.cursorDwell, true, ui);
  restCursor(tl, cursor, t);

  return playWhenVisible(node, tl);
}

function projects(node) {
  const items = [...node.querySelectorAll('[data-stage-item]')];
  const cursor = node.querySelector('[data-stage-cursor]');
  const ui = node.querySelector('.stage-ui');
  const all = node.querySelector('[data-stage-filter="all"]');
  const fav = node.querySelector('[data-stage-filter="fav"]');
  const row = node.querySelector('[data-stage-row]');
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: DUR.stageHold,
    defaults: { duration: DUR.reveal, ease: EASE.enter },
  });

  const reset = () => {
    gsap.set(items, hidden());
    all?.classList.add('is-on');
    fav?.classList.remove('is-on', 'is-hot');
    row?.classList.remove('is-on', 'is-hot');
    parkCursor(cursor);
    if (ui) gsap.set(ui, { scale: 1 });
  };
  reset();
  tl.add(reset, 0);
  tl.to(items, { ...shown, stagger: STAGGER.item }, STAGGER.item);

  let t = revealCursor(tl, cursor, DUR.reveal * followAt + STAGGER.item * items.length);
  t = aim(tl, cursor, node, fav, t);
  t = click(tl, cursor, fav, t + DUR.cursorDwell, true, ui);
  tl.add(() => { all?.classList.remove('is-on'); }, t - DUR.cursorPress);
  t = aim(tl, cursor, node, row, t);
  t = click(tl, cursor, row, t + DUR.cursorDwell, true, ui);
  t = aim(tl, cursor, node, all, t);
  t = click(tl, cursor, all, t + DUR.cursorDwell, true, ui);
  tl.add(() => { fav?.classList.remove('is-on'); }, t - DUR.cursorDwell);
  restCursor(tl, cursor, t);

  return playWhenVisible(node, tl);
}

const BUILDERS = { brain, architect, preview, projects };

export function featureStages(root = document) {
  const nodes = [...root.querySelectorAll('[data-feature-stage]')];
  if (!nodes.length) return () => {};

  if (prefersReducedMotion()) {
    nodes.forEach((node) => {
      node.querySelector('.stage-ui--preview')?.classList.add('is-ready');
      const typed = node.querySelector('[data-stage-type]');
      if (typed) typed.textContent = typed.dataset.full || typed.textContent || ARCHITECT_PROMPT;
      parkCursor(node.querySelector('[data-stage-cursor]'));
    });
    return () => {};
  }

  const stops = nodes.map((node) => {
    const kind = node.dataset.featureStage;
    const build = BUILDERS[kind];
    return build ? build(node) : () => {};
  });

  return () => {
    stops.forEach((stop) => { try { stop(); } catch { /* teardown */ } });
    gsap.set(root.querySelectorAll('[data-stage-item]'), { clearProps: 'all' });
    root.querySelectorAll('[data-stage-cursor]').forEach((el) => parkCursor(el));
  };
}
