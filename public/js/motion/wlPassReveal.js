/**
 * White Label Pass · Framer-style sticky scale-on-scroll “eat up”.
 *
 * Pins `#white-label-pass` while scrubbing the inner `.wl-pass__frame`:
 * scale + border-radius + slight lift. Next content then covers the plate.
 * Hang-tag swing stays on `.wl-pass__hang` / card — this module only
 * transforms the frame wrapper.
 *
 * Reduced motion: no pin, no scrub.
 */

import { prefersReducedMotion } from './tokens.js';

const SECTION_ID = 'white-label-pass';
const FRAME_SEL = '.wl-pass__frame';
const SCALE_END = 0.9;
const RADIUS_END_PX = 28;
const Y_END_PX = -18;
const PIN_DISTANCE = '+=95%';

function resetFrame(frame) {
  gsap.set(frame, { clearProps: 'transform,borderRadius,scale,y,willChange' });
  frame.style.willChange = '';
}

export function wlPassReveal() {
  const section = document.getElementById(SECTION_ID);
  const frame = section?.querySelector(FRAME_SEL);
  if (!section || !frame) return () => {};

  if (prefersReducedMotion()) {
    resetFrame(frame);
    return () => resetFrame(frame);
  }

  frame.style.willChange = 'transform, border-radius';

  const tween = gsap.fromTo(
    frame,
    {
      scale: 1,
      y: 0,
      borderRadius: 0,
    },
    {
      scale: SCALE_END,
      y: Y_END_PX,
      borderRadius: RADIUS_END_PX,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: PIN_DISTANCE,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    resetFrame(frame);
  };
}
