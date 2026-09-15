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

  const shell = root.querySelector('[data-wl-mastra]');
  const clip = root.querySelector('[data-wl-shell-clip]');
  const pathEl = root.querySelector('[data-wl-shell-path]');

  const readShellMetrics = () => {
    const styles = shell ? getComputedStyle(shell) : null;
    const readPx = (name, fallback) => {
      if (!styles) return fallback;
      const raw = styles.getPropertyValue(name).trim();
      const n = Number.parseFloat(raw);
      return Number.isFinite(n) ? n : fallback;
    };
    const tabH = readPx('--wl-mastra-tab-h', 48);
    const gapY = readPx('--wl-mastra-gap', 14);
    const tabGap = readPx('--wl-mastra-tab-gap', 12);
    const corner = readPx('--wl-mastra-path-radius', 16);
    const tabCorner = readPx('--wl-mastra-radius', 14);
    const notchMax = readPx('--wl-mastra-notch', 28);
    return {
      bodyTop: tabH + gapY,
      tabGap,
      corner,
      tabCorner,
      notchMax,
      tabCount: tabs.length,
    };
  };

  const buildShellPath = ({
    activeIndex,
    shellHeight,
    tabGap,
    tabCount,
    width,
    bodyTop,
    corner,
    tabCorner,
    notchMax,
  }) => {
    const w = Math.max(width, 80);
    const count = Math.max(tabCount, 1);
    const tabWidth = (w - tabGap * Math.max(count - 1, 0)) / count;
    const clampedIndex = Math.max(0, Math.min(activeIndex, count - 1));
    const activeLeft = clampedIndex * (tabWidth + tabGap);
    const activeRight = activeLeft + tabWidth;
    const outer = Math.min(corner, Math.max(8, (shellHeight - bodyTop) / 2));
    const tabRadius = Math.min(tabCorner || corner, tabWidth / 2);
    const notch = Math.min(notchMax, bodyTop - tabRadius, tabWidth / 2);
    const isFirst = activeLeft <= 0.5;
    const isLast = activeRight >= w - 0.5;

    const parts = isFirst
      ? [`M ${tabRadius} 0`, `H ${activeRight - tabRadius}`, `A ${tabRadius} ${tabRadius} 0 0 1 ${activeRight} ${tabRadius}`]
      : [
          `M ${outer} ${bodyTop}`,
          `H ${activeLeft - notch}`,
          `A ${notch} ${notch} 0 0 0 ${activeLeft} ${bodyTop - notch}`,
          `V ${tabRadius}`,
          `A ${tabRadius} ${tabRadius} 0 0 1 ${activeLeft + tabRadius} 0`,
          `H ${activeRight - tabRadius}`,
          `A ${tabRadius} ${tabRadius} 0 0 1 ${activeRight} ${tabRadius}`,
        ];

    if (isLast) {
      parts.push(`V ${shellHeight - outer}`, `A ${outer} ${outer} 0 0 1 ${w - outer} ${shellHeight}`);
    } else {
      parts.push(
        `V ${bodyTop - notch}`,
        `A ${notch} ${notch} 0 0 0 ${activeRight + notch} ${bodyTop}`,
        `H ${w - outer}`,
        `A ${outer} ${outer} 0 0 1 ${w} ${bodyTop + outer}`,
        `V ${shellHeight - outer}`,
        `A ${outer} ${outer} 0 0 1 ${w - outer} ${shellHeight}`
      );
    }

    parts.push(`H ${outer}`, `A ${outer} ${outer} 0 0 1 0 ${shellHeight - outer}`);

    if (isFirst) {
      parts.push(`V ${tabRadius}`, `A ${tabRadius} ${tabRadius} 0 0 1 ${tabRadius} 0`);
    } else {
      parts.push(`V ${bodyTop + outer}`, `A ${outer} ${outer} 0 0 1 ${outer} ${bodyTop}`);
    }

    parts.push('Z');
    return parts.join(' ');
  };

  let activeId = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')?.getAttribute('data-wl-tab')
    || tabs[0].getAttribute('data-wl-tab');

  const activeIndex = () => {
    const i = tabs.findIndex((tab) => tab.getAttribute('data-wl-tab') === activeId);
    return i < 0 ? 0 : i;
  };

  const updateShell = () => {
    if (!shell || !clip || !pathEl) return;
    const width = shell.clientWidth;
    const height = shell.clientHeight;
    const metrics = readShellMetrics();
    if (width < 80 || height < metrics.bodyTop + 64) return;
    const d = buildShellPath({
      activeIndex: activeIndex(),
      shellHeight: height,
      width,
      ...metrics,
    });
    clip.style.clipPath = `path("${d}")`;
    pathEl.setAttribute('d', d);
  };

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
      panel.setAttribute('aria-hidden', String(!on));
      panel.toggleAttribute('hidden', !on);
    });
    updateShell();
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

  let ro = null;
  if (shell && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateShell());
    ro.observe(shell);
  } else {
    window.addEventListener('resize', updateShell);
  }

  setActive(activeId);

  return () => {
    tabs.forEach((tab) => {
      tab.removeEventListener('click', onClick);
      tab.removeEventListener('keydown', onKey);
    });
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', updateShell);
  };
}
