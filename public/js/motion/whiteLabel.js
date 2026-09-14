/**
 * White Label Brand Takeover
 * Home: AIWA → Northstar morph on #white-label (scroll once + mouseenter replay)
 * Page: Sign-in / Builder / Pricing panel swaps on /white-label hero
 */

import { prefersReducedMotion } from './tokens.js';

const HOME_STEPS = ['is-step-brand', 'is-step-wash', 'is-step-done'];
const HOME_STEP_MS = [0, 900, 1800, 2800];

export function whiteLabelHome() {
  const root = document.querySelector('[data-wl-takeover="home"]');
  if (!root) return () => {};

  const stage = root.querySelector('.wl-takeover');
  if (!stage) return () => {};

  if (prefersReducedMotion()) {
    stage.classList.add('is-step-done');
    return () => {};
  }

  let timers = [];
  let playing = false;

  const clearTimers = () => {
    timers.forEach((id) => clearTimeout(id));
    timers = [];
  };

  const reset = () => {
    clearTimers();
    playing = false;
    stage.classList.remove('is-playing', ...HOME_STEPS);
    const typed = stage.querySelector('.wl-takeover__type');
    if (typed) {
      typed.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      typed.offsetWidth;
      typed.style.animation = '';
    }
  };

  const play = () => {
    reset();
    playing = true;
    stage.classList.add('is-playing');
    HOME_STEPS.forEach((cls, i) => {
      const id = setTimeout(() => {
        HOME_STEPS.forEach((c) => stage.classList.remove(c));
        stage.classList.add(cls);
        if (cls === 'is-step-done') playing = false;
      }, HOME_STEP_MS[i + 1]);
      timers.push(id);
    });
  };

  const onEnter = () => {
    play();
  };

  const io = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    play();
    io.disconnect();
  }, { threshold: 0.35 });

  io.observe(root);
  root.addEventListener('mouseenter', onEnter);

  return () => {
    clearTimers();
    io.disconnect();
    root.removeEventListener('mouseenter', onEnter);
  };
}

export function whiteLabelPage() {
  const root = document.querySelector('[data-wl-takeover="page"]');
  if (!root) return () => {};

  const tabs = [...root.querySelectorAll('[data-wl-tab]')];
  const panels = [...root.querySelectorAll('[data-wl-panel]')];
  if (!tabs.length || !panels.length) return () => {};

  const setActive = (id) => {
    tabs.forEach((tab) => {
      const on = tab.getAttribute('data-wl-tab') === id;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel) => {
      const on = panel.getAttribute('data-wl-panel') === id;
      panel.classList.toggle('is-active', on);
      panel.setAttribute('aria-hidden', String(!on));
    });
  };

  const onClick = (event) => {
    const tab = event.currentTarget;
    const id = tab.getAttribute('data-wl-tab');
    if (!id) return;
    setActive(id);
  };

  const onKey = (event) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const i = tabs.indexOf(event.currentTarget);
    if (i < 0) return;
    let next = i;
    if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    setActive(tabs[next].getAttribute('data-wl-tab'));
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', onClick);
    tab.addEventListener('keydown', onKey);
  });

  return () => {
    tabs.forEach((tab) => {
      tab.removeEventListener('click', onClick);
      tab.removeEventListener('keydown', onKey);
    });
  };
}
