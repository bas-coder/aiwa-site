'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'Does BJCRUM replace the systems teams already use?',
    a: 'No. BJCRUM integrates directly with your existing infrastructure. You can connect third-party APIs, Stripe webhooks, external PostgreSQL databases, or custom REST/GraphQL endpoints with zero friction.',
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
    a: 'BJCRUM runs automated TypeScript type-checking, schema validation, and integration tests before presenting each iteration, catching edge cases automatically.',
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
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 mb-4">
            Common Questions
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-heading)]">
            Got Questions?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
            See how BJCRUM builds real, working apps for you from start to finish.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-[var(--color-line-default)] bg-[var(--color-surface-surface)] overflow-hidden shadow-sm hover:border-brand-primary/40 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-base sm:text-lg font-semibold text-[var(--color-text-heading)] pr-4">
                    {faq.q}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-surface-cards)] border border-[var(--color-line-subtle)] text-[var(--color-text-muted)] shrink-0 transition-transform duration-200">
                    <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45 text-brand-primary' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-line-subtle)] pt-4 animate-in fade-in-50 duration-200">
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
