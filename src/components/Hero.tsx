'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, Paperclip, ChevronDown, Database, ArrowRight } from 'lucide-react';
import RobotHeadCanvas from './RobotHeadCanvas';

export default function Hero() {
  const [caretVisible, setCaretVisible] = useState(true);

  // Caret blinking effect for "Built with Auth_"
  useEffect(() => {
    const timer = setInterval(() => {
      setCaretVisible(v => !v);
    }, 530);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden shimmer-grid">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-primary/10 dark:bg-brand-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges & Announcement */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-[var(--color-line-default)] bg-[var(--color-surface-surface)]/80 text-[var(--color-text-muted)] shadow-sm backdrop-blur-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            <span>The full stack app builder, zero setup</span>
          </div>

          {/* Main Hero Headlines */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--color-text-heading)] max-w-4xl leading-[1.08]">
            Meet your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#38bdf8] to-brand-primary">AI Product Team</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl font-normal leading-relaxed">
            Describe an app, <span className="text-[var(--color-text-heading)] font-semibold">get a real one</span>. Built with Auth
            <span className={`${caretVisible ? 'opacity-100' : 'opacity-0'} text-brand-primary font-mono font-bold transition-opacity`}>_</span>
          </p>
        </div>

        {/* Interactive Prompt Box with 3D Robot Head */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto relative">
          
          {/* Floating 3D Robot Head */}
          <div className="flex justify-center -mb-10 sm:-mb-14 relative z-20 pointer-events-auto">
            <RobotHeadCanvas className="w-56 h-56 sm:w-64 sm:h-64 cursor-grab active:cursor-grabbing" />
          </div>

          {/* Prompt Container Card */}
          <div className="relative z-10 rounded-2xl border border-[var(--color-line-default)] bg-[var(--color-surface-surface)] shadow-2xl p-5 sm:p-7 backdrop-blur-xl transition-all">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line-subtle)] text-xs text-[var(--color-text-muted)]">
              <span className="font-mono font-medium text-[var(--color-text-disabled)]">PROMPT ENGINE v2.4</span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Dictate prompt"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-[var(--color-state-layout)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 text-brand-primary" />
                  <span className="hidden sm:inline">Dictate</span>
                </button>

                <button
                  type="button"
                  aria-label="Attach files"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-[var(--color-state-layout)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Attach</span>
                </button>
              </div>
            </div>

            {/* Prompt Content Area */}
            <div className="py-4">
              <p className="font-mono text-sm sm:text-base text-[var(--color-text-body)] leading-relaxed">
                Build a real-time collaborative workspace with user auth, instant Postgres tables, live presence indicators, markdown editing, and an automated Stripe billing checkout flow.
              </p>
            </div>

            {/* Bottom Controls & Build Button */}
            <div className="pt-3 border-t border-[var(--color-line-subtle)] flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-2.5">
                {/* Model Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-line-subtle)] bg-[var(--color-surface-cards)] text-xs font-medium text-[var(--color-text-body)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Claude Sonnet 4.6</span>
                  <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
                </div>

                {/* Database Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-line-subtle)] bg-[var(--color-surface-cards)] text-xs font-medium text-[var(--color-text-body)]">
                  <Database className="w-3 h-3 text-brand-primary" />
                  <span>Instant Postgres</span>
                  <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Build CTA Button */}
              <a
                href="https://app.aiwa.codes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:brightness-110 shadow-glow-primary active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build App</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>
            </div>

          </div>

          {/* Subtext CTA */}
          <div className="mt-5 text-center">
            <span className="text-xs text-[var(--color-text-muted)]">
              Try it free · No credit card required · Instant deployment
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
