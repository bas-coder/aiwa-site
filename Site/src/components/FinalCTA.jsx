import React, { useState } from 'react';

export default function FinalCTA() {
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
    <section id="final" className="relative overflow-hidden py-24 bg-surface-canvas border-t border-white/[0.08]">
      {/* Background Radial Glow */}
      <div 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full opacity-25 blur-[120px]"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0284C7 0%, #49A6D7 50%, rgba(18,18,17,0) 100%)'
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Ready to launch?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary flex items-center justify-center gap-1.5">
          <span>Claim your</span>
          <svg className="w-5 h-5 text-white flex-shrink-0 inline-block fill-current" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M216,72H180.92c.39-.33.79-.65,1.17-1A29.53,29.53,0,0,0,192,49.57V48a32,32,0,0,0-32-32h-1.57A29.53,29.53,0,0,0,136,25.91c-.34.38-.66.78-1,1.17V24a8,8,0,0,0-16,0v3.08c-.33-.39-.65-.79-1-1.17A29.53,29.53,0,0,0,97.57,16H96A32,32,0,0,0,64,48v1.57A29.53,29.53,0,0,0,73.91,72H40A16,16,0,0,0,24,88v32a16,16,0,0,0,16,16v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM160,32h1.57a14,14,0,0,1,9.9,4.1,13.88,13.88,0,0,1,4.1,9.9V48a16,16,0,0,1-16,16H136V48A16,16,0,0,1,152,32.39ZM80,48a13.88,13.88,0,0,1,4.1-9.9A14,14,0,0,1,94,34H96a16,16,0,0,1,16,16V64H96A16,16,0,0,1,80,49.57ZM40,88H120v32H40ZM120,200H56V136h64Zm80,0H136V136h64Zm16-80H136V88h80Z"/>
          </svg>
          <span className="font-semibold text-white">45 free welcome credits</span>
          <span>today and start building the future of software.</span>
        </p>

        {/* Quick Start Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-xl flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-white/[0.12] bg-surface-sidebar p-2 shadow-glow-primary backdrop-blur-xl"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type what you want to build..."
            className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-text-muted outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto flex-shrink-0 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-semibold text-white shadow-glow-primary hover:brightness-110 active:scale-95 transition-all"
          >
            Claim 45 Credits
          </button>
        </form>

        <p className="mt-4 text-xs text-text-muted">
          Cancel anytime · Upgrades prorated automatically by Stripe · Secure checkout
        </p>
      </div>
    </section>
  );
}
