import React, { useState } from 'react';

const faqs = [
  {
    q: 'Does BJCRUMBS replace the systems teams already use?',
    a: 'No. BJCRUMBS integrates directly with your existing infrastructure. You can connect third-party APIs, Stripe webhooks, external PostgreSQL databases, or custom REST/GraphQL endpoints with zero friction.',
  },
  {
    q: 'Will the bot mess up my app if I edit it later?',
    a: 'Never. Every generation and prompt edit is managed with isolated, version-controlled diffs. You can preview changes in an isolated branch, roll back at any second, or make manual code adjustments without conflict.',
  },
  {
    q: 'How do I pay for what I build?',
    a: 'Pricing is simple and transparent. You select a fixed monthly or annual plan. There are zero hidden compute fees, no per-query charges, and no surprise cloud bills.',
  },
  {
    q: 'Do I need to find the bugs myself?',
    a: 'BJCRUMBS runs automated TypeScript type-checking, schema validation, and integration tests before presenting each iteration, catching edge cases automatically.',
  },
  {
    q: 'Can I use my own custom web link?',
    a: 'Yes, custom domains and subdomains are supported on all plans with automated, zero-config SSL certificate provisioning.',
  },
  {
    q: 'Who owns the final code?',
    a: 'You own 100% of the code, database schema, and assets. You can download and run your project independently anywhere, anytime, with zero lock-in.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-surface border-t border-white/[0.08]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-wider text-brand-accent font-semibold">
            Common Questions
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mt-3">
            Got Questions?
          </h2>
          <p className="mt-4 text-text-secondary text-base">
            See how BJCRUMBS builds real, working apps for you from start to finish.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.08] bg-surface-card overflow-hidden transition-colors hover:border-white/[0.15]"
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-base font-semibold text-white pr-4">
                    {faq.q}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-sidebar border border-white/[0.08] text-text-secondary flex-shrink-0">
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-45 text-brand-accent' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-text-secondary leading-relaxed border-t border-white/[0.04] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
