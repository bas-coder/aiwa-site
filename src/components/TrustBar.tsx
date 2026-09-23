'use client';

import React from 'react';

const avatars = [
  '/images/1i9y2cgFKUC7eYPnyu1cBP4BHc_81dcf3.jpg',
  '/images/2d3OIEeSFjznRTlhNb3F8yCwEtc_81dcf3.jpg',
  '/images/Bb4EG1i14f43vkprtadPdtfA8G0_81dcf3.jpg',
  '/images/ByjJI6AO3xMN63FQbQdWA1XqLg_81dcf3.jpg',
  '/images/JkrlDFl674mgxOzqm1foVA9sXQ_81dcf3.jpg',
];

const partners = [
  'Vercel', 'Supabase', 'Stripe', 'Anthropic', 'OpenAI', 'GitHub'
];

export default function TrustBar() {
  return (
    <section className="py-12 border-y border-[var(--color-line-subtle)] bg-[var(--color-surface-surface)]/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Trust Header with Avatars */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          {/* Avatar Stack */}
          <div className="flex -space-x-2.5 overflow-hidden">
            {avatars.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt="Founder avatar"
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--color-surface-canvas)] object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/566csQkwAzFmNqUmvFdjzVkalo.jpg';
                }}
              />
            ))}
          </div>

          <p className="text-xs sm:text-sm font-medium text-[var(--color-text-muted)] max-w-xl">
            Trusted by <span className="font-semibold text-[var(--color-text-heading)]">14,000+</span> founders, agencies, and developers building the next generation of software.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
          {partners.map((partner, i) => (
            <span
              key={i}
              className="font-mono text-sm sm:text-base font-bold tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
            >
              {partner}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
