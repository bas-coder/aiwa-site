'use client';

import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

const EUR_RATE = 0.905;

const soloTiers = [
  {
    id: 'free',
    name: 'Free',
    badge: 'No card required',
    credits: 60,
    priceUSD: 0,
    subText: 'Free access, no card required',
    margin: null
  },
  {
    id: 'solo-200',
    name: 'Solo 200',
    badge: null,
    credits: 200,
    priceUSD: 29,
    subText: '200 credits a month',
    margin: '+$9.00 margin'
  },
  {
    id: 'solo-515',
    name: 'Solo 515',
    badge: 'Popular',
    credits: 515,
    priceUSD: 59,
    subText: '515 credits a month',
    margin: '+$7.50 margin'
  },
  {
    id: 'solo-1030',
    name: 'Solo 1030',
    badge: null,
    credits: 1030,
    priceUSD: 99,
    subText: '1,030 credits a month',
    margin: '+$6.00 margin'
  }
];

const agencyTiers = [
  {
    id: 'agency-1100',
    name: 'Agency 1100',
    badge: null,
    credits: 1100,
    priceUSD: 149,
    subText: '1,100 credits a month',
    margin: '+$39.00 margin'
  },
  {
    id: 'agency-2535',
    name: 'Agency 2535',
    badge: 'Best Value',
    credits: 2535,
    priceUSD: 299,
    subText: '2,535 credits a month',
    margin: '+$45.50 margin'
  },
  {
    id: 'agency-4455',
    name: 'Agency 4455',
    badge: 'High Velocity',
    credits: 4455,
    priceUSD: 549,
    subText: '4,455 credits a month',
    margin: '+$103.50 margin'
  }
];

const soloFeatures = [
  { text: 'The full AI builder with live preview', isNew: false },
  { text: 'Publish to a live URL, or your own custom domain', isNew: false },
  { text: 'Max, the deep agent, on every build', isNew: false },
  { text: 'Code export and GitHub sync', isNew: false },
  { text: '10 AI + 20 stock images per project', isNew: false },
  { text: 'Version history and restore', isNew: false }
];

const agencyFeatures = [
  { text: 'Everything in Solo', isNew: false },
  { text: 'Invite clients to review and comment', isNew: true },
  { text: 'Admin role + team seats (up to 15 seats)', isNew: false },
  { text: 'Visibility controls: public, unlisted or private', isNew: false },
  { text: 'Android APK, Play Store and App Store kits', isNew: true },
  { text: 'Largest image budget: 25 AI + 50 stock per project', isNew: false }
];

export default function PricingSection() {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [selectedSoloIdx, setSelectedSoloIdx] = useState(2); // Solo 515 default
  const [selectedAgencyIdx, setSelectedAgencyIdx] = useState(1); // Agency 2535 default

  const formatPrice = (usd: number) => {
    if (usd === 0) return currency === 'EUR' ? '€0' : '$0';
    if (currency === 'EUR') {
      const eur = Math.round(usd * EUR_RATE);
      return `€${eur}`;
    }
    return `$${usd}`;
  };

  const solo = soloTiers[selectedSoloIdx];
  const agency = agencyTiers[selectedAgencyIdx];

  return (
    <section id="pricing" className="py-20 md:py-32 relative bg-[var(--color-surface-cards)]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 mb-4">
            Transparent Pricing
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-heading)]">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
            Simple, credit-backed plans charged on your Stripe. Wholesale is $0.10 a credit. Everything above is your margin.
          </p>

          {/* Currency Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center p-1 rounded-xl bg-[var(--color-surface-surface)] border border-[var(--color-line-default)] shadow-sm">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currency === 'USD'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currency === 'EUR'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
                }`}
              >
                EUR (€)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* 1. Solo Card */}
          <div className="rounded-3xl border border-[var(--color-line-default)] bg-[var(--color-surface-surface)] p-8 sm:p-10 shadow-xl flex flex-col justify-between relative transition-all">
            <div>
              {/* Header & Badges */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-text-heading)]">
                    Solo
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    For individual builders & founders
                  </p>
                </div>
                {solo.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {solo.badge}
                  </span>
                )}
              </div>

              {/* Price & Cadence */}
              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black text-[var(--color-text-heading)]">
                    {formatPrice(solo.priceUSD)}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-muted)]">
                    / month
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                  {solo.subText}
                </p>
              </div>

              {/* Credit Tiers Selector */}
              <div className="my-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                  Monthly Credits
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {soloTiers.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedSoloIdx(idx)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center border ${
                        selectedSoloIdx === idx
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-[var(--color-surface-cards)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] border-[var(--color-line-subtle)]'
                      }`}
                    >
                      {t.credits}
                    </button>
                  ))}
                </div>
                {solo.margin && (
                  <div className="mt-2.5 flex justify-end">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {solo.margin}
                    </span>
                  </div>
                )}
              </div>

              {/* Feature Checklist */}
              <div className="pt-6 border-t border-[var(--color-line-subtle)] space-y-3.5">
                {soloFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[var(--color-text-body)]">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe Action Button */}
            <div className="mt-8 pt-6 border-t border-[var(--color-line-subtle)]">
              <a
                href="https://app.aiwa.codes/pricing"
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-[var(--color-text-heading)] bg-[var(--color-action-secondary)] hover:bg-[var(--color-action-secondary-hover)] border border-[var(--color-line-default)] flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                {solo.priceUSD === 0 ? 'Start Free' : `Subscribe to ${solo.name}`}
              </a>
            </div>
          </div>

          {/* 2. Agency Card (Highlighted) */}
          <div className="rounded-3xl border-2 border-brand-primary bg-[var(--color-surface-surface)] p-8 sm:p-10 shadow-2xl flex flex-col justify-between relative transition-all">
            <div>
              {/* Header & Badges */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-text-heading)]">
                    Agency
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    For client teams & high velocity builders
                  </p>
                </div>
                {agency.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{agency.badge}</span>
                  </span>
                )}
              </div>

              {/* Price & Cadence */}
              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black text-[var(--color-text-heading)]">
                    {formatPrice(agency.priceUSD)}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-muted)]">
                    / month
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                  {agency.subText}
                </p>
              </div>

              {/* Agency Tiers Selector */}
              <div className="my-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                  Monthly Credits
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {agencyTiers.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedAgencyIdx(idx)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center border ${
                        selectedAgencyIdx === idx
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-[var(--color-surface-cards)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] border-[var(--color-line-subtle)]'
                      }`}
                    >
                      {t.credits}
                    </button>
                  ))}
                </div>
                {agency.margin && (
                  <div className="mt-2.5 flex justify-end">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {agency.margin}
                    </span>
                  </div>
                )}
              </div>

              {/* Feature Checklist */}
              <div className="pt-6 border-t border-[var(--color-line-subtle)] space-y-3.5">
                {agencyFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[var(--color-text-body)]">
                    <Check className="w-4 h-4 text-brand-primary shrink-0" />
                    <span className="flex items-center gap-2">
                      <span>{f.text}</span>
                      {f.isNew && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-primary/15 text-brand-primary uppercase">
                          New
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe Action Button */}
            <div className="mt-8 pt-6 border-t border-[var(--color-line-subtle)]">
              <a
                href="https://app.aiwa.codes/pricing"
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:brightness-110 shadow-glow-primary flex items-center justify-center transition-all active:scale-95"
              >
                Subscribe to {agency.name}
              </a>
            </div>
          </div>

        </div>

        {/* Guarantee Note */}
        <p className="mt-10 text-center text-xs text-[var(--color-text-muted)] italic">
          Cancel anytime · Upgrades prorated automatically by Stripe · Secure 256-bit checkout
        </p>

      </div>
    </section>
  );
}
