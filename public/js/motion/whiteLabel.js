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
  const tourBtn = root.querySelector('[data-wl-tour]');
  const canvas = root.querySelector('[data-wl-product-canvas]');
  const status = root.querySelector('[data-wl-preview-status]');
  let viewport = 'desktop';
  let tourTimer = null;
  const fit = () => {
    if (!canvas || !frame) return;
    const width = viewport === 'mobile' ? 390 : 1280;
    const scale = canvas.parentElement.clientWidth / width;
    canvas.style.width = `${width}px`;
    canvas.style.height = '800px';
    canvas.style.transform = `scale(${scale})`;
    canvas.parentElement.style.height = `${800 * scale}px`;
  };
  const observer = new ResizeObserver(fit);
  if (frame) observer.observe(frame);
  const stopTour = () => {
    clearInterval(tourTimer);
    tourTimer = null;
    tourBtn?.setAttribute('aria-pressed', 'false');
    tourBtn?.setAttribute('aria-label', 'Play the screen tour');
    const icon = tourBtn?.querySelector('.ph');
    icon?.classList.replace('ph-pause', 'ph-play');
  };
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
    if (status) status.textContent = `Preview of Actionist: ${id === 'signin' ? 'Sign in' : id} on ${viewport}`;
  };

  const setViewport = (mode) => {
    viewport = mode;
    frame?.classList.toggle('is-mobile', mode === 'mobile');
    viewportBtns.forEach((btn) => {
      const on = btn.getAttribute('data-wl-viewport') === mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    fit();
    if (status) status.textContent = `Preview of Actionist: ${activeId === 'signin' ? 'Sign in' : activeId} on ${viewport}`;
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

    const doc = document;
    if (expanded) {
      const req = root.requestFullscreen
        || root.webkitRequestFullscreen
        || root.msRequestFullscreen;
      if (typeof req === 'function') {
        try { req.call(root)?.catch?.(() => {}); } catch (_) { /* fixed overlay fallback */ }
      }
      return;
    }

    const activeFs = doc.fullscreenElement
      || doc.webkitFullscreenElement
      || doc.msFullscreenElement;
    if (activeFs) {
      const exit = doc.exitFullscreen
        || doc.webkitExitFullscreen
        || doc.msExitFullscreen;
      if (typeof exit === 'function') {
        try { exit.call(doc); } catch (_) { /* ignore */ }
      }
    }
  };

  const onFullscreenChange = () => {
    const activeFs = document.fullscreenElement
      || document.webkitFullscreenElement
      || document.msFullscreenElement;
    if (!activeFs && expanded) setExpanded(false);
  };

  const onTabClick = (event) => {
    stopTour();
    const id = event.currentTarget.getAttribute('data-wl-tab');
    if (!id) return;
    setActive(id);
  };

  const onTabKey = (event) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    stopTour();
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
  const onTourClick = () => {
    if (tourTimer) { stopTour(); return; }
    setActive('loading');
    tourBtn.setAttribute('aria-pressed', 'true');
    tourBtn.setAttribute('aria-label', 'Pause the screen tour');
    tourBtn.querySelector('.ph')?.classList.replace('ph-play', 'ph-pause');
    tourTimer = setInterval(() => {
      const ids = tabs.map(tab => tab.dataset.wlTab);
      setActive(ids[(ids.indexOf(activeId) + 1) % ids.length]);
    }, 3000);
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
  tourBtn?.addEventListener('click', onTourClick);
  document.addEventListener('keydown', onDocKey);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  setActive(activeId);
  setViewport('desktop');
  setExpanded(false);

  return () => {
    observer.disconnect();
    stopTour();
    tourBtn?.removeEventListener('click', onTourClick);
    teardownTakeover();
    tabs.forEach((tab) => {
      tab.removeEventListener('click', onTabClick);
      tab.removeEventListener('keydown', onTabKey);
    });
    viewportBtns.forEach((btn) => btn.removeEventListener('click', onViewportClick));
    expandBtn?.removeEventListener('click', onExpandClick);
    document.removeEventListener('keydown', onDocKey);
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    document.documentElement.classList.remove('wl-preview-lock');
    if (expanded) {
      const exit = document.exitFullscreen
        || document.webkitExitFullscreen
        || document.msExitFullscreen;
      if (typeof exit === 'function') {
        try { exit.call(document); } catch (_) { /* ignore */ }
      }
    }
  };
}
