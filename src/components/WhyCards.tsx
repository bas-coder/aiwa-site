'use client';

import React from 'react';
import { Brain, CheckCircle2, Zap, Unlock } from 'lucide-react';

const cards = [
  {
    icon: Brain,
    title: 'Persistent Context & Memory',
    description: 'Never re-explain your app. Max retains your full codebase architecture, database decisions, and design guidelines across every conversation turn.',
    image: '/images/45SPWvWFYm1Rf6yzzCfOql7Ed6M_014a4f.png',
  },
  {
    icon: CheckCircle2,
    title: 'Autonomous Testing & Diagnostics',
    description: 'Self-healing routines test every component, route, and SQL query in real-time before presenting the live preview. Zero syntax or compiler errors.',
    image: '/images/4QJwf0IpAezr82J9AosKZkRuVM_a691aa.png',
  },
  {
    icon: Zap,
    title: 'Instant Full-Stack Delivery',
    description: 'Deploy live in seconds with production SSL, global CDN edge caching, and automated Postgres migrations. Ready for real customers immediately.',
    image: '/images/anJYVlwqcNJZADfT76VLM7ueg_014a4f.png',
  },
  {
    icon: Unlock,
    title: '100% Clean Code Ownership',
    description: 'Export standard React, Next.js, and TypeScript code anytime. Synchronize seamlessly with your private GitHub repo. Zero proprietary runtime lock-in.',
    image: '/images/wqHWpq5sFiInSW15KWBcQjF9C08_014a4f.png',
  },
];

export default function WhyCards() {
  return (
    <section id="features" className="py-20 md:py-32 bg-[var(--color-surface-cards)]/40 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 mb-4">
            Why BJCRUM
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-heading)]">
            Built differently from the ground up
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
            Engineered to eliminate boilerplate, fragile generation loops, and vendor lock-in.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="group relative rounded-3xl border border-[var(--color-line-default)] bg-[var(--color-surface-surface)] p-8 sm:p-10 shadow-lg hover:border-brand-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Text Content */}
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-text-heading)]">
                    {card.title}
                  </h3>
                  
                  <p className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Card Visual Graphic */}
                <div className="mt-8 pt-4 flex justify-center relative z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="rounded-xl max-h-48 w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Subtle corner hover glow */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/15 transition-all pointer-events-none" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
