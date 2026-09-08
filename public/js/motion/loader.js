/**
 * Preloader.
 *
 * CSS paints the overlay and logo on first paint. This module only ticks the
 * stage labels and dismisses the overlay after both a minimum beat and the
 * caller's gate (fonts.ready). It does not depend on GSAP: a failed tween
 * used to leave the mark at opacity 0 forever, which read as "no preloader".
 *
 * Shown on every full page load. Session skip made refresh look broken, and it
 * also skipped the font-cover job this overlay exists to do.
 */

import { prefersReducedMotion } from './tokens.js';

const STAGE_MS = 160;
const MIN_SHOW_MS = 1500;
const EXIT_MS = 550;
const FAILSAFE_MS = 4500;
const LOADING_CLASS = 'is-loading';
const LEAVING_CLASS = 'is-leaving';
const STAGE_ON_CLASS = 'is-on';

const clearFailsafe = () => {
  const id = window.__aiwaLoaderFailsafe;
  if (id) {
    window.clearTimeout(id);
    window.__aiwaLoaderFailsafe = 0;
  }
};

const unlock = () => {
  document.documentElement.classList.remove(LOADING_CLASS);
};

const settle = (value) => Promise.resolve(value).catch(() => {});

export function runLoader(until = Promise.resolve()) {
  const loader = document.getElementById('loader');
  if (!loader) {
    unlock();
    return Promise.resolve();
  }

  document.documentElement.classList.add(LOADING_CLASS);
  clearFailsafe();

  const reduced = prefersReducedMotion();
  const stages = [...loader.querySelectorAll('[data-loader-stage]')];
  let stageIndex = 0;
  const tickStage = () => {
    if (!stages.length) return;
    stages.forEach((el, i) => el.classList.toggle(STAGE_ON_CLASS, i === stageIndex));
    stageIndex = (stageIndex + 1) % stages.length;
  };
  tickStage();
  const stageTimer = reduced ? 0 : window.setInterval(tickStage, STAGE_MS);

  const minShow = MIN_SHOW_MS;
  let settled = false;

  return new Promise((resolve) => {
    const finish = () => {
      if (settled) return;
      settled = true;
      if (stageTimer) window.clearInterval(stageTimer);
      unlock();
      loader.classList.add(LEAVING_CLASS);
      resolve();
      const delay = reduced ? 0 : EXIT_MS;
      window.setTimeout(() => loader.remove(), delay);
    };

    const minTimer = new Promise((done) => {
      window.setTimeout(done, minShow);
    });

    Promise.all([settle(until), minTimer]).then(finish);
    window.setTimeout(finish, FAILSAFE_MS);
  });
}
