/**
 * Motion tokens - the JS half of css/tokens.css.
 *
 * Spec §1.2-§1.5. These are the only numbers any animation in this project is
 * allowed to reach for; if something needs a value that isn't here, it either
 * belongs here or the animation is wrong.
 */

export const EASE = {
  primary: 'power3.inOut',   // headline reveal, entrance elements
  enter: 'power2.out',       // small element reveals, blur-in
  soft: 'power4.inOut',      // the scroll blur-reveal system
  scrub: 'none',             // §1.2 IMPORTANT: scroll velocity IS the curve.
};

export const DUR = {
  micro: 0.35,
  base: 0.4,
  entrance: 0.5,
  reveal: 0.8,
  atmosphere: 1.0,
  sweep: 1.0,
  gradientText: 2.2,
  /* Feature-stage timings, ported with the animated Why cards. */
  stageHold: 3.2,
  typeChar: 0.04,
  cursorTravel: 0.62,
  cursorTravelMax: 0.95,
  cursorPress: 0.22,
  cursorDwell: 0.32,
  stageZoom: 0.34,
  stageZoomOut: 0.4,
};

export const STAGGER = {
  char: 0.03,
  item: 0.1,
  overlap: 0.3,
  entranceOverlap: '-=0.3',
};

export const REVEAL = {
  y: '2em',
  blur: 20,
  atmosphereBlur: 15,
};

export const BP = {
  desktop: 1440,
  wide: 992,
  tablet: 480,
};

/** §1.5 - read from CSS so there is exactly one definition of the accent. */
export const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** A stage that is off-screen or on a hidden tab should not run its loop. */
export const pageVisible = () => document.visibilityState !== 'hidden';

export const ACCENT = () => cssVar('--accent') || '#fea002';
export const INK = () => cssVar('--cream-050') || '#fbf9f6';

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * §5.3 - will-change hygiene. Set it right before, clear it 500ms after.
 * Leaving it on permanently is a top cause of mobile memory pressure, and it
 * is invisible until a phone starts dropping frames on an unrelated section.
 */
export function withWillChange(targets, props) {
  const list = gsap.utils.toArray(targets);
  list.forEach((el) => { el.style.willChange = props; });
  return () => setTimeout(() => list.forEach((el) => { el.style.willChange = ''; }), 500);
}
