'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-[var(--color-line-subtle)] bg-[var(--color-surface-cards)]/60 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--color-line-subtle)]">
          
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] shadow-sm">
                <span className="font-mono text-base font-black text-white">B</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-[var(--color-text-heading)]">
                BJCRUMB
              </span>
            </Link>

            <p className="text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">
              The full stack autonomous app builder. From prompt to production deployment with zero setup and 100% code ownership.
            </p>

            <div className="pt-2">
              <a
                href="mailto:fax@bjcrum.com"
                className="font-mono text-xs text-brand-primary hover:underline"
              >
                fax@bjcrum.com
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-text-heading)]">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
              <li>
                <a href="#features" className="hover:text-[var(--color-text-heading)] transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[var(--color-text-heading)] transition-colors">Pricing</a>
              </li>
              <li>
                <a href="https://app.aiwa.codes/resources" className="hover:text-[var(--color-text-heading)] transition-colors">Resources</a>
              </li>
              <li>
                <a href="https://docs.bjcrum.com/" className="hover:text-[var(--color-text-heading)] transition-colors">Documentation</a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-text-heading)]">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
              <li>
                <a href="https://app.aiwa.codes/terms" className="hover:text-[var(--color-text-heading)] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="https://app.aiwa.codes/terms" className="hover:text-[var(--color-text-heading)] transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="https://whatsapp.com/channel/0029VbDca4V35fLsolEQpi10" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text-heading)] transition-colors inline-flex items-center gap-1">
                  <span>Community</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-text-heading)]">
              Join our newsletter
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Get the latest updates on autonomous agent development and feature drops.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Check className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl text-xs bg-[var(--color-surface-surface)] border border-[var(--color-line-default)] text-[var(--color-text-body)] placeholder-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-line-subtle)] bg-[var(--color-surface-surface)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[var(--color-text-body)]">All Systems Operational</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/aiwacodes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-text-heading)] transition-colors font-medium"
            >
              LinkedIn
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbDca4V35fLsolEQpi10"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-text-heading)] transition-colors font-medium"
            >
              WhatsApp
            </a>
            <a
              href="https://x.com/aiwadotcodes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-text-heading)] transition-colors font-medium"
            >
              X (Twitter)
            </a>
          </div>

          {/* Copyright */}
          <div>
            <span>© 2026 BJCRUMB. All rights reserved.</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
