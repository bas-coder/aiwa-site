/**
 * From Idea to Working Product — hero scrub.
 *
 * Lives inside `.hero__panel.is-3` (center-sticky copy) + `.scene--idea` stack.
 * Scroll through the panel maps progress → active step + stack translateY.
 * Stack is a column flex with gap; stride is measured in px so the gap scrolls
 * through with each card (Lovable-style).
 *
 * Reduced motion: first panel static, first step active.
 */

import { prefersReducedMotion } from './tokens.js';

const STEP_COUNT = 4;
const ACTIVE_CLASS = 'is-active';
const DONE_CLASS = 'is-done';

function stackStridePx(stack) {
  const panels = stack.querySelectorAll('.idea__panel');
  if (panels.length < 2) {
    return panels[0]?.offsetHeight || 0;
  }
  return panels[1].offsetTop - panels[0].offsetTop;
}

function applyProgress(steps, stack, progress) {
  const scaled = progress * STEP_COUNT;
  const activeIndex = Math.min(
    STEP_COUNT - 1,
    Math.floor(scaled >= STEP_COUNT ? STEP_COUNT - 1 : scaled),
  );

  steps.forEach((step, index) => {
    const isActive = index === activeIndex;
    const isDone = index < activeIndex || (progress >= 1 && index === STEP_COUNT - 1);
    step.classList.toggle(ACTIVE_CLASS, isActive);
    step.classList.toggle(DONE_CLASS, isDone);
  });

  if (stack) {
    const stride = stackStridePx(stack);
    const offset = progress * (STEP_COUNT - 1) * stride;
    stack.style.transform = `translate3d(0, ${-offset}px, 0)`;
  }
}

function resetVisuals(steps, stack) {
  steps.forEach((step) => {
    step.classList.remove(ACTIVE_CLASS, DONE_CLASS);
  });
  if (steps[0]) steps[0].classList.add(ACTIVE_CLASS);
  if (stack) stack.style.transform = '';
}

export function ideaScrub(root = document) {
  const panel = root.querySelector('[data-idea-panel]') || root.querySelector('.hero__panel.is-3');
  const stack = root.querySelector('[data-idea-stack]');
  const steps = [...root.querySelectorAll('[data-idea-step]')];

  if (!panel || !stack || !steps.length) return () => {};

  if (prefersReducedMotion()) {
    resetVisuals(steps, stack);
    return () => resetVisuals(steps, stack);
  }

  resetVisuals(steps, stack);

  const copy = panel.querySelector('.hero__idea') || panel;

  const st = ScrollTrigger.create({
    trigger: copy,
    start: 'center center',
    endTrigger: panel,
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => applyProgress(steps, stack, self.progress),
    onRefresh: (self) => applyProgress(steps, stack, self.progress),
  });

  applyProgress(steps, stack, st.progress || 0);

  return () => {
    st.kill();
    resetVisuals(steps, stack);
    gsap.set(stack, { clearProps: 'transform' });
  };
}
