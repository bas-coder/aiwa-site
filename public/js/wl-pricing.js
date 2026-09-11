/**
 * White-Label program billing switch.
 *
 * Homepage pricingSwitch() binds the first [data-billing-switch] on the
 * document and is not loaded on subpages. This one is scoped to #wl-pricing,
 * swaps the recurring card's copy/CTA, and toggles the yearly promo chrome.
 * Yearly checkout is a launch-target URL; engineering owns the charge.
 */

const BILLING_MONTHLY = 'monthly';
const BILLING_ANNUAL = 'annual';

const CHECKOUT = {
  [BILLING_MONTHLY]: 'https://app.aiwa.codes/partner?checkout=monthly',
  [BILLING_ANNUAL]: 'https://app.aiwa.codes/partner?checkout=annual',
};

const CTA_LABEL = {
  [BILLING_MONTHLY]: 'Start monthly',
  [BILLING_ANNUAL]: 'Get yearly access',
};

const FEATURED_CLASS = 'plan--featured';

export function wlPricingSwitch() {
  const section = document.querySelector('#wl-pricing');
  if (!section) return () => {};

  const root = section.querySelector('[data-wl-billing-switch]');
  const recurring = section.querySelector('[data-wl-card="recurring"]');
  const cta = section.querySelector('[data-wl-cta]');
  const flag = section.querySelector('[data-wl-flag]');
  if (!root || !recurring || !cta) return () => {};

  const opts = [...root.querySelectorAll('.switch__opt')];
  const ctaLabel = cta.querySelector('.btn__label');

  const apply = (mode) => {
    const isAnnual = mode === BILLING_ANNUAL;
    root.dataset.billing = mode;
    opts.forEach((opt) => {
      const on = opt.dataset.billing === mode;
      opt.classList.toggle('is-active', on);
      opt.setAttribute('aria-pressed', String(on));
    });
    section.querySelectorAll('[data-price]').forEach((el) => {
      el.hidden = el.dataset.price !== mode;
    });
    section.querySelectorAll('[data-billing-note]').forEach((el) => {
      el.hidden = el.dataset.billingNote !== mode;
    });
    recurring.classList.toggle(FEATURED_CLASS, isAnnual);
    if (flag) flag.hidden = !isAnnual;
    cta.setAttribute('href', CHECKOUT[mode]);
    if (ctaLabel) ctaLabel.textContent = CTA_LABEL[mode];
  };

  const onClick = (event) => apply(event.currentTarget.dataset.billing);
  opts.forEach((opt) => opt.addEventListener('click', onClick));
  apply(root.dataset.billing || BILLING_ANNUAL);

  return () => opts.forEach((opt) => opt.removeEventListener('click', onClick));
}
