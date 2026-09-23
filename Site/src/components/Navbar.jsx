import React, { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo with Lighter Blue Text */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero shadow-glow-primary">
            <span className="font-mono text-lg font-black text-white">B</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-sky-300 group-hover:text-sky-200 transition-colors">
            BJCRUMBS
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Secondary Button - Solid Fill */}
          <a
            href="https://app.aiwa.codes/login"
            className="rounded-xl border border-white/[0.12] bg-surface-card px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-elevated hover:border-brand-accent/40 transition-all"
          >
            Sign in
          </a>
          {/* Primary CTA */}
          <a
            href="https://app.aiwa.codes"
            className="rounded-xl bg-gradient-hero px-4 py-2 text-sm font-semibold text-white shadow-glow-primary hover:brightness-110 active:scale-95 transition-all"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-text-secondary hover:bg-surface-card"
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-surface-card px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-text-secondary hover:text-white">Features</a>
          <a href="#demo" className="block text-sm font-medium text-text-secondary hover:text-white">Demo</a>
          <a href="#pricing" className="block text-sm font-medium text-text-secondary hover:text-white">Pricing</a>
          <a href="#faq" className="block text-sm font-medium text-text-secondary hover:text-white">FAQ</a>
          <div className="pt-2 flex flex-col gap-2">
            <a href="https://app.aiwa.codes/login" className="rounded-xl border border-white/[0.12] bg-surface-sidebar py-2 text-center text-sm font-medium text-text-primary">
              Sign in
            </a>
            <a href="https://app.aiwa.codes" className="rounded-xl bg-gradient-hero py-2 text-center text-sm font-semibold text-white">
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
