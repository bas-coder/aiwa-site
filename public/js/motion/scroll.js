/**
 * Scroll hygiene - §5.4.
 *
 * ScrollTrigger.refresh() re-measures every trigger on the page. Calling it
 * mid-scroll on iOS kills momentum scrolling outright: the page stops dead
 * under the finger. So anything that changes page height while the user may be
 * scrolling - an accordion opening, an image finally decoding - asks for a
 * refresh rather than taking one, and the request is flushed on scrollEnd.
 */

let pending = false;

/** Ask for a refresh at the next safe moment. Cheap; call it freely. */
export const queueRefresh = () => { pending = true; };

export function initRefreshQueue() {
  const flush = () => {
    if (!pending) return;
    pending = false;
    ScrollTrigger.refresh();
  };
  ScrollTrigger.addEventListener('scrollEnd', flush);
  return () => ScrollTrigger.removeEventListener('scrollEnd', flush);
}
