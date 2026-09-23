'use client';

import React from 'react';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Glow Container Card */}
        <div className="relative rounded-3xl border border-[var(--color-line-default)] bg-gradient-to-b from-[var(--color-surface-surface)] to-[var(--color-surface-cards)] p-10 sm:p-16 text-center shadow-2xl overflow-hidden">
          
          {/* Radial Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-primary/15 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Badges & Copy */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Access</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text-heading)] max-w-2xl mx-auto leading-tight">
            Ready to launch?
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
            Claim your <span className="font-semibold text-brand-primary font-mono">45 free welcome credits</span> today and start building the future of software.
          </p>

          {/* CTA Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://app.aiwa.codes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:brightness-110 shadow-glow-primary active:scale-95 transition-all"
            >
              <span>Start Building Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="https://whatsapp.com/channel/0029VbDca4V35fLsolEQpi10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[var(--color-text-heading)] bg-[var(--color-surface-surface)] hover:bg-[var(--color-action-secondary-hover)] border border-[var(--color-line-default)] shadow-sm active:scale-95 transition-all"
            >
              <span>Join the Community</span>
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </a>
          </div>

          <p className="mt-6 text-xs text-[var(--color-text-muted)]">
            No credit card required · Full API access · Deploy to custom domain in 60s
          </p>

        </div>

      </div>
    </section>
  );
}
