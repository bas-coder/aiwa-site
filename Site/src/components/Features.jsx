import React from 'react';

const features = [
  {
    title: 'Instant Postgres Database',
    description: 'Automatic relational schema design, migrations, and indexes pre-configured for every app you prompt.',
    icon: (
      <svg className="h-6 w-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6" />
      </svg>
    ),
    tag: 'Database',
  },
  {
    title: 'Pre-configured Auth & Roles',
    description: 'Protect user and client data out of the box with JWT sessions, Google OAuth, and granular role-based access.',
    icon: (
      <svg className="h-6 w-6 text-feedback-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    tag: 'Security',
  },
  {
    title: 'Zero Backend Bottlenecks',
    description: 'No Docker setup, no cloud console hurdles, and no API gateway configuration. Ship directly to a live URL in seconds.',
    icon: (
      <svg className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    tag: 'Deployment',
  },
  {
    title: 'Full Code Ownership',
    description: 'Never get locked in. Download clean, modular React, TypeScript, and Node.js code ready for any repo or staging environment.',
    icon: (
      <svg className="h-6 w-6 text-feedback-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    tag: 'Export',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-surface border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-brand-accent font-semibold">
            Architected For Builders
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mt-3">
            Everything your app needs. <br />
            Already configured.
          </h2>
          <p className="mt-4 text-text-secondary text-base leading-relaxed">
            Stop stitching together five different developer tools. BJCRUMBS handles state, storage, auth, and deployment automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/[0.08] bg-surface-card p-6 shadow-elevation-card hover:border-brand-accent/40 hover:bg-surface-elevated transition-all duration-200"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-sidebar border border-white/[0.08] mb-5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <span className="text-[11px] font-mono font-medium text-text-muted uppercase tracking-wider">
                {feature.tag}
              </span>
              <h3 className="text-lg font-semibold text-white mt-1 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
