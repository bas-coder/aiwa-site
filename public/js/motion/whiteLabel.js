/**
 * White Label Brand Takeover
 * Home: AIWA → Northstar morph on #white-label (scroll once + mouseenter replay)
 * Page: same takeover on /white-label #wl-idea + Own The Experience preview controls
 */

import { prefersReducedMotion } from './tokens.js';

const HOME_STEPS = ['is-step-brand', 'is-step-wash', 'is-step-done'];
const HOME_STEP_MS = [0, 900, 1800, 2800];

function bindTakeover(root) {
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

  const onActivate = (event) => {
    if (playing) return;
    if (event.type === 'click' && event.detail === 0) return;
    play();
  };

  const io = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    play();
    io.disconnect();
  }, { threshold: 0.35 });

  io.observe(root);
  root.addEventListener('mouseenter', onEnter);
  root.addEventListener('click', onActivate);
  root.style.cursor = root.style.cursor || 'pointer';
  root.setAttribute('tabindex', root.getAttribute('tabindex') || '0');
  const onKey = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onActivate(event);
  };
  root.addEventListener('keydown', onKey);

  return () => {
    clearTimers();
    io.disconnect();
    root.removeEventListener('mouseenter', onEnter);
    root.removeEventListener('click', onActivate);
    root.removeEventListener('keydown', onKey);
  };
}

export function whiteLabelHome() {
  const roots = [...document.querySelectorAll('[data-wl-takeover]')];
  if (!roots.length) return () => {};
  const teardowns = roots.map(bindTakeover);
  return () => {
    teardowns.forEach((fn) => fn());
  };
}

export function whiteLabelPage() {
  const teardownTakeover = whiteLabelHome();

  const root = document.querySelector('[data-wl-preview]');
  if (!root) return teardownTakeover;

  const tabs = [...root.querySelectorAll('[data-wl-tab]')];
  const panels = [...root.querySelectorAll('[data-wl-panel]')];
  const viewportBtns = [...root.querySelectorAll('[data-wl-viewport]')];
  const frame = root.querySelector('[data-wl-preview-frame]');
  const expandBtn = root.querySelector('[data-wl-preview-expand]');
  if (!tabs.length || !panels.length) return teardownTakeover;

  let activeId = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')?.getAttribute('data-wl-tab')
    || tabs[0].getAttribute('data-wl-tab');
  let expanded = false;

  const setActive = (id) => {
    activeId = id;
    tabs.forEach((tab) => {
      const on = tab.getAttribute('data-wl-tab') === id;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel) => {
      const on = panel.getAttribute('data-wl-panel') === id;
      panel.classList.toggle('is-active', on);
      panel.toggleAttribute('hidden', !on);
    });
  };

  const setViewport = (mode) => {
    frame?.classList.toggle('is-mobile', mode === 'mobile');
    viewportBtns.forEach((btn) => {
      const on = btn.getAttribute('data-wl-viewport') === mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  };

  const setExpanded = (next) => {
    expanded = next;
    root.classList.toggle('is-expanded', expanded);
    expandBtn?.setAttribute('aria-expanded', String(expanded));
    expandBtn?.setAttribute('aria-label', expanded ? 'Exit expanded preview' : 'Expand preview');
    const icon = expandBtn?.querySelector('.ph');
    if (icon) {
      icon.classList.toggle('ph-arrows-out', !expanded);
      icon.classList.toggle('ph-arrows-in', expanded);
    }
    document.documentElement.classList.toggle('wl-preview-lock', expanded);
  };

  const onTabClick = (event) => {
    const id = event.currentTarget.getAttribute('data-wl-tab');
    if (!id) return;
    setActive(id);
  };

  const onTabKey = (event) => {
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

  const onViewportClick = (event) => {
    const mode = event.currentTarget.getAttribute('data-wl-viewport');
    if (!mode) return;
    setViewport(mode);
  };

  const onExpandClick = () => {
    setExpanded(!expanded);
  };

  const onDocKey = (event) => {
    if (event.key !== 'Escape' || !expanded) return;
    setExpanded(false);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', onTabClick);
    tab.addEventListener('keydown', onTabKey);
  });
  viewportBtns.forEach((btn) => btn.addEventListener('click', onViewportClick));
  expandBtn?.addEventListener('click', onExpandClick);
  document.addEventListener('keydown', onDocKey);

  setActive(activeId);
  setViewport('desktop');
  setExpanded(false);

  return () => {
    teardownTakeover();
    tabs.forEach((tab) => {
      tab.removeEventListener('click', onTabClick);
      tab.removeEventListener('keydown', onTabKey);
    });
    viewportBtns.forEach((btn) => btn.removeEventListener('click', onViewportClick));
    expandBtn?.removeEventListener('click', onExpandClick);
    document.removeEventListener('keydown', onDocKey);
    document.documentElement.classList.remove('wl-preview-lock');
  };
}
