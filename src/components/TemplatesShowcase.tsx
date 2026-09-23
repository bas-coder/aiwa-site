'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const categories = ['All', 'SaaS', 'Mobile', 'CRM', 'Landing Pages'];

const projects = [
  {
    title: 'SaaS Analytics Dashboard',
    category: 'SaaS',
    description: 'Real-time telemetry, subscription MRR tracking, and team permissions with automated Stripe webhooks.',
    image: '/images/eBQU4mGjv64pxjCOyI9D24dweM_37800b.png',
  },
  {
    title: 'Autonomous CRM Suite',
    category: 'CRM',
    description: 'Pipeline stage automations, AI conversation summaries, and instant email sequence triggers.',
    image: '/images/gcJ9o7S1Ow5wHWpbicvvnZxN6W8_37800b.png',
  },
  {
    title: 'Native Mobile Health Tracker',
    category: 'Mobile',
    description: 'Cross-platform mobile interface with biometric auth, offline caching, and live notifications.',
    image: '/images/rULrgRqgbN6lLoU3sOyv8QfCRQk_37800b.png',
  },
  {
    title: 'High-Converting Landing Page',
    category: 'Landing Pages',
    description: 'Ultra-fast edge loading, responsive dark/light theme, and embedded lead-capture forms.',
    image: '/images/sKE7LTTp2EHq2Y2aLvO0GMlZY0_37800b.png',
  },
  {
    title: 'Developer Tooling Hub',
    category: 'SaaS',
    description: 'API key management, interactive documentation sandbox, and live webhook inspection.',
    image: '/images/zHEPED1Ple5F5h6FhbH1po6MWzQ_37800b.png',
  },
  {
    title: 'B2B Services Marketplace',
    category: 'CRM',
    description: 'Escrow milestones, client review portals, and automated proposal generation.',
    image: '/images/uA4X1BQ3H7HzVkkqFBRqpmNu2E_37800b.png',
  },
];

export default function TemplatesShowcase() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 mb-4">
            Showcase
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-heading)]">
            Made with BJCRUM
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
            Explore high-performing software built and launched with autonomous agent workflows.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-[var(--color-surface-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] border border-[var(--color-line-subtle)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-[var(--color-line-default)] bg-[var(--color-surface-surface)] overflow-hidden shadow-lg hover:shadow-xl hover:border-brand-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] bg-black/20 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/566csQkwAzFmNqUmvFdjzVkalo.jpg';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase">
                  {item.category}
                </span>
              </div>

              {/* Card Meta */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--color-text-heading)] group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--color-line-subtle)] flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-primary group-hover:underline inline-flex items-center gap-1">
                    <span>Inspect Architecture</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
