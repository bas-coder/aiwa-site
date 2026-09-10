/**
 * Footer newsletter form — frontend UX only.
 *
 * Success: Apply → Thank you (nav-style flip), button disabled until reload.
 * Duplicate: quiet status under the form (bottom-left).
 *
 * ENGINEERS: replace `subscribeNewsletter` with a real POST. Keep the return
 * shape `{ ok: true }` | `{ ok: false, reason: 'duplicate' | 'error' }` so the
 * UI wiring does not need to change.
 */

const STORAGE_KEY = 'aiwa.newsletter.emails';
const DUPLICATE_MSG = "You're already on the list.";
const ERROR_MSG = 'Something went wrong. Please try again.';

function readEmails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEmails(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* private mode / quota — UX still works for this session */
  }
}

/**
 * Temporary stand-in until a newsletter API exists.
 * @param {string} email
 * @returns {Promise<{ ok: true } | { ok: false, reason: 'duplicate' | 'error' }>}
 */
async function subscribeNewsletter(email) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { ok: false, reason: 'error' };

  const known = readEmails();
  if (known.includes(normalized)) {
    return { ok: false, reason: 'duplicate' };
  }

  known.push(normalized);
  writeEmails(known);
  return { ok: true };
}

function clearStatus(status) {
  if (!status) return;
  status.textContent = '';
  status.hidden = true;
  status.removeAttribute('data-tone');
}

function showStatus(status, message, tone) {
  if (!status) return;
  status.textContent = message;
  status.hidden = false;
  status.setAttribute('data-tone', tone);
}

function markDone(form, button, input) {
  form.classList.add('is-done');
  button.disabled = true;
  button.setAttribute('aria-disabled', 'true');
  if (input) input.readOnly = true;
}

export function footerNewsletter() {
  const form = document.querySelector('[data-footer-news]');
  if (!form) return () => {};

  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('.footer__news-submit');
  const status = form.querySelector('.footer__news-status');
  if (!input || !button) return () => {};

  let busy = false;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (busy || button.disabled) return;

    clearStatus(status);

    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }

    busy = true;
    button.setAttribute('aria-busy', 'true');

    try {
      const result = await subscribeNewsletter(input.value);
      if (result.ok) {
        markDone(form, button, input);
        return;
      }
      if (result.reason === 'duplicate') {
        showStatus(status, DUPLICATE_MSG, 'warn');
        return;
      }
      showStatus(status, ERROR_MSG, 'error');
    } catch {
      showStatus(status, ERROR_MSG, 'error');
    } finally {
      busy = false;
      button.removeAttribute('aria-busy');
    }
  };

  form.addEventListener('submit', onSubmit);
  return () => form.removeEventListener('submit', onSubmit);
}
