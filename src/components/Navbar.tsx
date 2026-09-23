'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bjcrum_theme', nextTheme);
    // Dispatch event so other components (like 3D/pricing) know theme changed
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-line-subtle)] bg-[var(--color-surface-canvas)]/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] shadow-sm">
            <span className="font-mono text-base font-black text-white">B</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[var(--color-text-heading)] group-hover:text-brand-primary transition-colors">
            BJCRUMB
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--color-text-muted)]">
          <a href="#features" className="hover:text-[var(--color-text-heading)] transition-colors">Features</a>
          <a href="#workflow" className="hover:text-[var(--color-text-heading)] transition-colors">Solution</a>
          <a href="#pricing" className="hover:text-[var(--color-text-heading)] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[var(--color-text-heading)] transition-colors">Learn</a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-state-layout)] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Join the Community WhatsApp CTA */}
          <a
            href="https://whatsapp.com/channel/0029VbDca4V35fLsolEQpi10"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-action-secondary)] hover:bg-[var(--color-action-secondary-hover)] text-[var(--color-text-heading)] border border-[var(--color-line-subtle)] shadow-sm transition-all"
          >
            <span>Join the Community</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Sign In CTA */}
          <a
            href="https://app.aiwa.codes/login"
            className="px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-body)] hover:text-[var(--color-text-heading)] transition-colors"
          >
            Sign in
          </a>

          {/* Primary CTA */}
          <a
            href="https://app.aiwa.codes"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white shadow-sm transition-all active:scale-95"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu & Theme Button */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-[var(--color-text-muted)]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--color-text-heading)]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--color-line-subtle)] bg-[var(--color-surface-canvas)] px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-medium text-sm text-[var(--color-text-muted)]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[var(--color-text-heading)]"
            >
              Features
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[var(--color-text-heading)]"
            >
              Solution
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[var(--color-text-heading)]"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[var(--color-text-heading)]"
            >
              Learn
            </a>
          </nav>

          <div className="pt-3 border-t border-[var(--color-line-subtle)] flex flex-col gap-2.5">
            <a
              href="https://whatsapp.com/channel/0029VbDca4V35fLsolEQpi10"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-xs font-semibold bg-[var(--color-action-secondary)] text-[var(--color-text-heading)] border border-[var(--color-line-subtle)]"
            >
              <span>Join the Community</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
            <a
              href="https://app.aiwa.codes"
              className="flex items-center justify-center w-full py-2.5 rounded-lg text-xs font-semibold bg-[var(--color-action-primary)] text-white shadow-sm"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
