import React, { useState } from 'react';

export default function Pricing() {
  // Solo family tiers
  const soloTiers = [
    {
      id: 'free',
      name: 'Free Starter',
      price: 0,
      credits: 60,
      cadence: 'one-time grant',
      badge: 'No Card Required',
      description: 'One-time starter grant. Never expires, full Solo builder access.',
      estApps: '~1 app prototype',
      ctaText: 'Claim 60 Free Credits',
      href: 'https://app.aiwa.codes',
    },
    {
      id: 'solo-200',
      name: 'Solo 200',
      price: 29,
      credits: 200,
      cadence: '/ month',
      badge: null,
      description: 'Perfect for active indie developers and solo creators.',
      estApps: '~4-5 full apps / mo',
      ctaText: 'Start with Solo 200',
      href: 'https://app.aiwa.codes',
    },
    {
      id: 'solo-515',
      name: 'Solo 515',
      price: 59,
      credits: 515,
      cadence: '/ month',
      badge: 'Popular for Creators',
      description: 'High volume building with Max deep reasoning.',
      estApps: '~10-12 full apps / mo',
      ctaText: 'Start with Solo 515',
      href: 'https://app.aiwa.codes',
    },
    {
      id: 'solo-1030',
      name: 'Solo 1030',
      price: 119,
      credits: 1030,
      cadence: '/ month',
      badge: 'Power Builder',
      description: 'Maximum Solo throughput for serial software founders.',
      estApps: '~20-25 full apps / mo',
      ctaText: 'Start with Solo 1030',
      href: 'https://app.aiwa.codes',
    },
  ];

  // Agency family tiers
  const agencyTiers = [
    {
      id: 'agency-1100',
      name: 'Agency 1100',
      price: 149,
      credits: 1100,
      cadence: '/ month',
      badge: null,
      description: 'Designed for small studios collaborating directly with clients.',
      estApps: '~25 full apps / mo',
      ctaText: 'Start with Agency 1100',
      href: 'https://app.aiwa.codes',
    },
    {
      id: 'agency-2535',
      name: 'Agency 2535',
      price: 299,
      credits: 2535,
      cadence: '/ month',
      badge: 'Best Value',
      description: 'The standard choice for production agencies shipping weekly.',
      estApps: '~55-60 full apps / mo',
      ctaText: 'Upgrade to Agency 2535',
      href: 'https://app.aiwa.codes',
    },
    {
      id: 'agency-4455',
      name: 'Agency 4455',
      price: 549,
      credits: 4455,
      cadence: '/ month',
      badge: 'High Velocity',
      description: 'Enterprise-grade agency throughput with multi-seat teams.',
      estApps: '~100+ full apps / mo',
      ctaText: 'Upgrade to Agency 4455',
      href: 'https://app.aiwa.codes',
    },
  ];

  const [selectedSoloIdx, setSelectedSoloIdx] = useState(2); // Default to Solo 515
  const [selectedAgencyIdx, setSelectedAgencyIdx] = useState(1); // Default to Agency 2535

  const currentSolo = soloTiers[selectedSoloIdx];
  const currentAgency = agencyTiers[selectedAgencyIdx];

  const soloFeatures = [
    'The full AI builder with live preview',
    'Publish to a live URL, or your own custom domain',
    'Max, the deep agent, on every build',
    'Code export and GitHub sync',
    '10 AI + 20 stock images per project',
    'Version history and restore',
  ];

  const agencyFeatures = [
    'Everything in Solo',
    'Invite clients to review and comment',
    'Up to 15 team seats with roles',
    'Public, unlisted or private visibility',
    'Android APK, Play Store and App Store kits',
    '25 AI + 50 stock images per project',
  ];

  return (
    <section id="pricing" className="py-24 bg-surface-canvas border-t border-white/[0.08] relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-brand-primary/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            Transparent White-Label Pricing
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Simple, credit-backed plans
          </h2>
          <p className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed">
            One builder or an entire agency shipping client projects. Choose your monthly volume stop, scale up, or adjust anytime.
          </p>

          {/* Free Starter Grant Highlight Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-feedback-success/30 bg-feedback-success/10 px-4 py-1.5 text-xs text-feedback-success font-medium">
            <svg className="w-4 h-4 text-feedback-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Free Starter:</strong> 60 credits granted once upon signup. Never expire. No credit card required.</span>
          </div>
        </div>

        {/* Pricing Cards: 2 Main Families */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card 1: SOLO FAMILY */}
          <div className="rounded-3xl border border-white/[0.1] bg-surface-card p-8 sm:p-10 flex flex-col justify-between shadow-elevation-card hover:border-white/[0.18] transition-all relative">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Solo</h3>
                  <p className="text-xs text-text-muted mt-0.5">One builder, their own workspace.</p>
                </div>
                {currentSolo.badge && (
                  <span className="rounded-full bg-feedback-success/10 border border-feedback-success/20 px-3 py-1 text-xs font-semibold text-feedback-success">
                    {currentSolo.badge}
                  </span>
                )}
              </div>

              {/* Tier Selector Tabs */}
              <div className="mt-6">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block mb-2">
                  Select Credit Tier:
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-surface-sidebar border border-white/[0.06]">
                  {soloTiers.map((tier, idx) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedSoloIdx(idx)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                        selectedSoloIdx === idx
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'text-text-secondary hover:text-white hover:bg-surface-elevated/40'
                      }`}
                    >
                      <div className="truncate">{tier.name.replace('Solo ', '')}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {tier.price === 0 ? '$0' : `$${tier.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div className="mt-7 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">
                  {currentSolo.price === 0 ? '$0' : `$${currentSolo.price}`}
                </span>
                <span className="text-sm font-medium text-text-muted">
                  {currentSolo.cadence}
                </span>
              </div>

              {/* Credits & App Delivery Estimate */}
              <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-sidebar px-3 py-1 text-xs font-mono font-medium text-sky-300 border border-white/[0.08]">
                  <svg className="w-3.5 h-3.5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14H8a4 4 0 01-.8-7.92 4.01 4.01 0 017.6 0A4 4 0 0112 14z" />
                  </svg>
                  {currentSolo.credits.toLocaleString()} credits
                </span>
                <span className="text-xs text-text-secondary">
                  {currentSolo.estApps}
                </span>
              </div>

              <p className="text-xs text-text-muted mt-2">
                {currentSolo.description}
              </p>

              {/* Verified Features List */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                  On the Solo Card:
                </div>
                <ul className="space-y-3 text-sm text-text-secondary">
                  {soloFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="h-4 w-4 text-feedback-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={feat.includes('Max') ? 'text-white font-medium' : ''}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 mt-6">
              <a
                href={currentSolo.href}
                className="block w-full rounded-xl border border-white/[0.12] bg-surface-sidebar py-3.5 text-center text-sm font-semibold text-white hover:bg-surface-elevated hover:border-brand-accent/40 active:scale-[0.99] transition-all"
              >
                {currentSolo.ctaText}
              </a>
            </div>
          </div>

          {/* Card 2: AGENCY FAMILY (Featured) */}
          <div className="relative rounded-3xl border-2 border-brand-primary bg-surface-card p-8 sm:p-10 flex flex-col justify-between shadow-glow-primary hover:border-brand-accent transition-all">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-hero px-4 py-1 text-xs font-extrabold text-white shadow-md tracking-wider uppercase flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Most Popular</span>
            </div>

            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Agency</h3>
                  <p className="text-xs text-text-muted mt-0.5">Teams that invite clients and ship with sign-off.</p>
                </div>
                {currentAgency.badge && (
                  <span className="rounded-full bg-brand-primary/20 text-brand-accent border border-brand-primary/30 px-3 py-1 text-xs font-semibold">
                    {currentAgency.badge}
                  </span>
                )}
              </div>

              {/* Tier Selector Tabs */}
              <div className="mt-6">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block mb-2">
                  Select Credit Tier:
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-sidebar border border-white/[0.06]">
                  {agencyTiers.map((tier, idx) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedAgencyIdx(idx)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                        selectedAgencyIdx === idx
                          ? 'bg-brand-primary text-white shadow-glow-primary'
                          : 'text-text-secondary hover:text-white hover:bg-surface-elevated/40'
                      }`}
                    >
                      <div className="truncate">{tier.name.replace('Agency ', '')}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">${tier.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div className="mt-7 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">
                  ${currentAgency.price}
                </span>
                <span className="text-sm font-medium text-text-muted">
                  {currentAgency.cadence}
                </span>
              </div>

              {/* Credits & App Delivery Estimate */}
              <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/15 px-3 py-1 text-xs font-mono font-semibold text-sky-200 border border-brand-primary/30">
                  <svg className="w-3.5 h-3.5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14H8a4 4 0 01-.8-7.92 4.01 4.01 0 017.6 0A4 4 0 0112 14z" />
                  </svg>
                  {currentAgency.credits.toLocaleString()} credits / mo
                </span>
                <span className="text-xs text-text-secondary font-medium">
                  {currentAgency.estApps}
                </span>
              </div>

              <p className="text-xs text-text-muted mt-2">
                {currentAgency.description}
              </p>

              {/* Verified Features List */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-accent mb-3">
                  On the Agency Card:
                </div>
                <ul className="space-y-3 text-sm text-text-secondary">
                  {agencyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={i === 0 ? 'text-white font-semibold' : 'text-text-primary'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 mt-6">
              <a
                href={currentAgency.href}
                className="block w-full rounded-xl bg-gradient-hero py-3.5 text-center text-sm font-semibold text-white shadow-glow-primary hover:brightness-110 active:scale-[0.99] transition-all"
              >
                {currentAgency.ctaText}
              </a>
            </div>
          </div>
        </div>

        {/* Top-up Credits & FAQ Strip */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-white/[0.08] bg-surface-sidebar/60 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-accent flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Need extra credits mid-month?</h4>
                <p className="text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
                  Run out of credits during a sprint? A <strong>$20 top-up buys 100 credits</strong> (20¢ per credit). Purchased credits never expire and roll over indefinitely.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
              <span className="text-xs font-mono text-sky-300 bg-surface-card border border-white/[0.1] px-3 py-1.5 rounded-lg">
                20¢ / credit
              </span>
              <a
                href="https://app.aiwa.codes"
                className="flex-1 md:flex-none text-center rounded-xl bg-surface-card border border-white/[0.12] px-4 py-2 text-xs font-semibold text-white hover:bg-surface-elevated transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Guarantee / Billing Footer */}
        <div className="mt-8 text-center text-xs text-text-muted">
          <span>Charged in US dollars on Stripe. Wholesale wholesale pool model. Cancel or change plans anytime from your BJCRUM dashboard.</span>
        </div>
      </div>
    </section>
  );
}
