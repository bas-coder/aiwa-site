import React, { useState } from 'react';

export default function Hero() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      window.location.href = `https://app.aiwa.codes?prompt=${encodeURIComponent(prompt)}`;
    } else {
      window.location.href = 'https://app.aiwa.codes';
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Ambient Radial Glow */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full opacity-35 blur-[120px]"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0284C7 0%, #49A6D7 40%, rgba(31,31,30,0) 100%)'
        }}
        aria-hidden="true"
      />

      {/* Hero Shimmer Grid Background (30% opacity) */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.10) 1.1px, transparent 1.9px)',
          backgroundSize: '20px 20px'
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-surface-card/60 px-3.5 py-1 text-xs font-medium text-text-secondary backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-feedback-success animate-pulse" />
          <span className="text-white">BJCRUM Mini</span>
          <span className="text-white/40">·</span>
          <span>Instant Postgres Included</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Meet your <span className="text-black/90 dark:text-white/80 font-normal">AI</span> <br />
          Product <span className="text-black/90 dark:text-white/80 font-normal">Team</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl leading-relaxed">
          Build production-ready software with AI agents that plan, architect, build, test, and evolve your application
        </p>

        {/* Interactive Prompt Command Center */}
        <div className="mx-auto mt-10 max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="group relative rounded-2xl border border-white/[0.12] bg-surface-sidebar p-3 shadow-elevation-card backdrop-blur-xl transition-all focus-within:border-brand-primary focus-within:shadow-glow-primary"
          >
            {/* Top Prompt Input */}
            <div className="flex items-center px-3 py-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app (e.g., Client CRM with invoicing & Stripe billing)..."
                className="w-full bg-transparent text-base text-white placeholder-text-muted outline-none font-medium"
              />
            </div>

            {/* Bottom Controls Bar */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3 px-2">
              {/* Left Configuration Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface-card px-2.5 py-1.5 text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
                >
                  <svg className="h-3.5 w-3.5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Claude Sonnet 4.6</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface-card px-2.5 py-1.5 text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
                >
                  <svg className="h-3.5 w-3.5 text-feedback-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
                  </svg>
                  <span>Instant Postgres</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-surface-card px-2.5 py-1.5 text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
                  title="Attach file"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>Attach</span>
                </button>
              </div>

              {/* Right Submit Action */}
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-hero px-5 py-2 text-sm font-semibold text-white shadow-glow-primary hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Build</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Micro Guarantee Under Box */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-feedback-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card required
            </span>
            <span>·</span>
            <span>Instant live preview</span>
            <span>·</span>
            <span>Export clean React &amp; Node code</span>
          </div>
        </div>

        {/* Social Proof / Trust Row */}
        <div className="mt-16 border-t border-white/[0.08] pt-10">
          <p className="text-xs uppercase tracking-wider text-text-muted font-medium">
            Trusted by 14,000+ founders, agencies and developers worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
