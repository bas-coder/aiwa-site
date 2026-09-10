/**
 * Warm the idea-scrub plates so they are decoded before the user reaches
 * panel 3. The scene starts at autoAlpha 0 (visibility:hidden), which makes
 * browsers deprioritise those assets — and a multi-megabyte GIF in the stack
 * used to stall the rest.
 *
 * The loader waits only for the FIRST plate (the one on screen when the beat
 * starts). The rest decode in the background. Holding the overlay for the
 * whole stack would stall first paint on below-fold art.
 */

const FIRST_PLATE_CAP_MS = 2200;

function settle(value) {
  return Promise.resolve(value).catch(() => {});
}

function warmImage(img) {
  const decode = () => (img.decode ? settle(img.decode()) : Promise.resolve());
  if (img.complete && img.naturalWidth) return decode();
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(decode()), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });
}

function warmVideo(video) {
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  try { video.load(); } catch { /* older WebKit: ignore */ }
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
  return new Promise((resolve) => {
    video.addEventListener('loadeddata', () => resolve(), { once: true });
    video.addEventListener('error', () => resolve(), { once: true });
  });
}

export function warmIdeaArt(root = document) {
  const stack = root.querySelector('[data-idea-stack]');
  if (!stack) return Promise.resolve();

  const images = [...stack.querySelectorAll('img')];
  const videos = [...stack.querySelectorAll('video')];

  images.slice(1).forEach((img) => { void warmImage(img); });
  videos.forEach((video) => { void warmVideo(video); });

  const first = images[0];
  if (!first) return Promise.resolve();

  const cap = new Promise((done) => { window.setTimeout(done, FIRST_PLATE_CAP_MS); });
  return Promise.race([warmImage(first), cap]);
}
