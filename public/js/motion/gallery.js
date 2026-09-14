/**
 * Gallery plate actions — copy prompt + use-template links.
 * Event-delegated so one listener covers the whole contact sheet.
 */

const COPY_OK = 'Copied';
const COPY_IDLE = 'Copy prompt';
const COPY_MS = 1600;

async function writeClipboard(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through */ }

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}

function flashCopied(btn) {
  const label = btn.querySelector('[data-shot-copy-label]');
  btn.classList.add('is-copied');
  if (label) label.textContent = COPY_OK;
  window.setTimeout(() => {
    btn.classList.remove('is-copied');
    if (label) label.textContent = COPY_IDLE;
  }, COPY_MS);
}

export function galleryActions() {
  const root = document.getElementById('gallery');
  if (!root) return () => {};

  const onClick = async (e) => {
    const btn = e.target.closest('[data-shot-copy]');
    if (!btn || !root.contains(btn)) return;
    e.preventDefault();
    const shot = btn.closest('[data-shot]');
    const prompt = shot?.getAttribute('data-prompt')?.trim();
    if (!prompt) return;
    const ok = await writeClipboard(prompt);
    if (ok) flashCopied(btn);
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
