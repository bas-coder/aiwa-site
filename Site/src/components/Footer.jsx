import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-surface-canvas py-16 text-sm text-text-muted">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero shadow-glow-primary">
                <span className="font-mono text-base font-black text-white">B</span>
              </div>
              <span className="text-lg font-extrabold text-sky-300 tracking-tight">BJCRUM</span>
            </div>
            <p className="max-w-sm text-xs text-text-secondary leading-relaxed">
              Build full-stack web &amp; mobile applications for clients in minutes. Instant databases, authentication, and deployment without managing backends.
            </p>
            {/* System Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-sidebar px-3 py-1 text-xs text-text-secondary">
              <span className="flex h-2 w-2 rounded-full bg-feedback-success animate-pulse" />
              <span className="text-white text-[11px]">All Systems Operational</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a></li>
              <li><a href="https://app.aiwa.codes" className="hover:text-white transition-colors">App Builder</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Resources &amp; Legal</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="mailto:support@bjcrum.com" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© {new Date().getFullYear()} BJCRUM Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">Status</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
