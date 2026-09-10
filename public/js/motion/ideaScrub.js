/**
 * From Idea to Working Product — hero scrub.
 *
 * Lives inside `.hero__panel.is-3` (center-sticky copy) + `.scene--idea` stack.
 * Scroll through the panel maps progress → active step + stack translateY.
 * Stack is a column flex with gap; stride is measured in px so the gap scrolls
 * through with each card (Lovable-style).
 *
 * Trigger is the PANEL, not the sticky copy. Sticky triggers keep their
 * visual center locked, so GSAP bunches leftover progress into the last
 * plate — left labels finish while the stack still needs a viewport of
 * extra scroll. Start/end are the in-flow copy center → just before the
 * shell's bottom padding, so each plate gets the same distance.
 *
 * Left labels switch when the incoming plate is mostly seated, so they
 * cannot get ahead of the visual.
 *
 * Reduced motion: first panel static, first step active.
 */

import { prefersReducedMotion } from './tokens.js';

const ACTIVE_CLASS = 'is-active';
const DONE_CLASS = 'is-done';
const IDEA_PLATE_ATTR = 'ideaPlate';
/** Next step lights when the stack is this far toward that plate (0–1). */
const PLATE_ARRIVE = 0.82;

function stackStridePx(stack) {
  const panels = stack.querySelectorAll('.idea__panel');
  if (panels.length < 2) {
    return panels[0]?.offsetHeight || 0;
  }
  return panels[1].offsetTop - panels[0].offsetTop;
}

function scrubWindow(panel, copy) {
  const shell = panel.querySelector('.shell') || panel;
  const styles = getComputedStyle(shell);
  const padTop = parseFloat(styles.paddingTop) || 0;
  const padBottom = parseFloat(styles.paddingBottom) || 0;
  const copyH = copy.offsetHeight || 0;
  return {
    start: `top+=${padTop + copyH / 2} center`,
    end: `bottom-=${padBottom} bottom`,
  };
}

function plateIndex(platePos, maxPlate) {
  if (maxPlate === 0) return 0;
  const arriveOffset = 1 - PLATE_ARRIVE;
  return Math.min(maxPlate, Math.max(0, Math.floor(platePos + arriveOffset)));
}

function syncPlateVideo(stack, platePos) {
  const reduced = prefersReducedMotion();
  const panels = [...stack.querySelectorAll('.idea__panel')];
  panels.forEach((panel, index) => {
    const video = panel.querySelector('video');
    if (!video) return;
    const onPlate = platePos > index - 0.45 && platePos < index + 0.45;
    const shouldPlay = !reduced && onPlate;
    if (shouldPlay) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  });
}

function applyProgress(steps, stack, progress) {
  const stepCount = Math.max(steps.length, 1);
  const maxPlate = Math.max(stepCount - 1, 0);
  const travel = Math.min(1, Math.max(0, progress));
  const platePos = travel * maxPlate;
  const activeIndex = plateIndex(platePos, maxPlate);

  steps.forEach((step, index) => {
    const isActive = index === activeIndex;
    const isDone = index < activeIndex || (travel >= 1 && index === maxPlate);
    step.classList.toggle(ACTIVE_CLASS, isActive);
    step.classList.toggle(DONE_CLASS, isDone);
  });

  document.documentElement.dataset[IDEA_PLATE_ATTR] = String(activeIndex);

  if (stack) {
    const stride = stackStridePx(stack);
    stack.style.transform = `translate3d(0, ${-platePos * stride}px, 0)`;
    syncPlateVideo(stack, platePos);
  }
}

function resetVisuals(steps, stack) {
  steps.forEach((step) => {
    step.classList.remove(ACTIVE_CLASS, DONE_CLASS);
  });
  if (steps[0]) steps[0].classList.add(ACTIVE_CLASS);
  delete document.documentElement.dataset[IDEA_PLATE_ATTR];
  if (stack) {
    stack.style.transform = '';
    syncPlateVideo(stack, 0);
  }
}

export function ideaScrub(root = document) {
  const panel = root.querySelector('[data-idea-panel]') || root.querySelector('.hero__panel.is-3');
  const stack = root.querySelector('[data-idea-stack]');
  const steps = [...root.querySelectorAll('[data-idea-step]')];
  const IDEA_SCRUB_CLASS = 'is-idea-scrub';

  if (!panel || !stack || !steps.length) return () => {};

  if (prefersReducedMotion()) {
    resetVisuals(steps, stack);
    return () => resetVisuals(steps, stack);
  }

  resetVisuals(steps, stack);

  const copy = panel.querySelector('.hero__idea') || panel;
  const windowOf = () => scrubWindow(panel, copy);

  /* Flat FAQ fill (`--ink-900`) for the whole tall panel run. */
  const fillST = ScrollTrigger.create({
    trigger: panel,
    start: 'top top',
    end: 'bottom bottom',
    toggleClass: { targets: document.documentElement, className: IDEA_SCRUB_CLASS },
  });

  const st = ScrollTrigger.create({
    trigger: panel,
    start: () => windowOf().start,
    end: () => windowOf().end,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => applyProgress(steps, stack, self.progress),
    onRefresh: (self) => applyProgress(steps, stack, self.progress),
  });

  /* Art can finish after first measure — re-stride when each plate lands. */
  const onArtLoad = () => {
    ScrollTrigger.refresh();
    applyProgress(steps, stack, st.progress || 0);
  };
  stack.querySelectorAll('img, video').forEach((el) => {
    if (el.tagName === 'IMG' && el.complete) return;
    if (el.tagName === 'VIDEO' && el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return;
    el.addEventListener('load', onArtLoad, { once: true });
    el.addEventListener('loadeddata', onArtLoad, { once: true });
    el.addEventListener('error', onArtLoad, { once: true });
  });

  applyProgress(steps, stack, st.progress || 0);

  return () => {
    fillST.kill();
    st.kill();
    document.documentElement.classList.remove(IDEA_SCRUB_CLASS);
    resetVisuals(steps, stack);
    gsap.set(stack, { clearProps: 'transform' });
  };
}
