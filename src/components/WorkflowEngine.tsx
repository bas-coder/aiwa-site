'use client';

import React, { useState } from 'react';
import { Compass, Cpu, Code2, ShieldCheck, RefreshCw, Play } from 'lucide-react';

const stages = [
  {
    id: 'plan',
    title: 'PLAN',
    icon: Compass,
    headline: 'Define goals & product specifications',
    description: 'Transform high-level prompts into granular engineering requirements, database schemas, and user stories with autonomous AI breakdown.'
  },
  {
    id: 'architect',
    title: 'ARCHITECT',
    icon: Cpu,
    headline: 'System design & data contracts',
    description: 'Generates secure SQL schemas, edge API routes, and modular component hierarchies tailored for high performance and scalability.'
  },
  {
    id: 'build',
    title: 'BUILD',
    icon: Code2,
    headline: 'Full-stack generation with live preview',
    description: 'Writes production-grade TypeScript, Tailwind CSS, and server actions. Experience sub-second hot updates directly in your live browser preview.'
  },
  {
    id: 'test',
    title: 'TEST',
    icon: ShieldCheck,
    headline: 'Autonomous verification & self-healing',
    description: 'Runs compiler diagnostics and automated browser tests. If an edge case fails, Max the AI agent catches the error and self-corrects the code.'
  },
  {
    id: 'evolve',
    title: 'EVOLVE',
    icon: RefreshCw,
    headline: 'Iterate features with zero lock-in',
    description: 'Easily branch, migrate databases, export clean source code, or synchronize directly with your private GitHub repository anytime.'
  }
];

export default function WorkflowEngine() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="workflow" className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 mb-4">
            Autonomous Lifecycle
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-heading)]">
            Our Agentic Workflow Engine
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
            BJCRUM doesn’t just generate code. It manages your entire product lifecycle.
          </p>
        </div>

        {/* 5 Stages Navigation Bar */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-[var(--color-surface-cards)] border border-[var(--color-line-subtle)] gap-1 shadow-sm">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--color-surface-surface)] text-[var(--color-text-heading)] shadow-md border border-[var(--color-line-subtle)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-surface-surface)]/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-[var(--color-text-muted)]'}`} />
                  <span>{stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Details & Demo Display */}
        <div className="mt-12 rounded-3xl border border-[var(--color-line-default)] bg-[var(--color-surface-surface)] p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Stage Info */}
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase">
                STAGE 0{activeStage + 1} OF 05
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text-heading)]">
                {stages[activeStage].headline}
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                {stages[activeStage].description}
              </p>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href="https://app.aiwa.codes"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] shadow-sm transition-all"
                >
                  <span>Experience {stages[activeStage].title}</span>
                </a>
              </div>
            </div>

            {/* Video / Diagram Canvas Showcase */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-[var(--color-line-subtle)] bg-black/40 aspect-video flex items-center justify-center shadow-inner">
              <video
                src="/videos/demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white/80 border border-white/10 flex items-center gap-1.5">
                <Play className="w-2.5 h-2.5 text-brand-primary fill-brand-primary" />
                <span>LIVE PRODUCT DEMO</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
