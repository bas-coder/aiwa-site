import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0284c7',
          primaryDark: '#0369a1',
          accent: '#38bdf8',
          glow: 'rgba(2, 132, 199, 0.25)',
          whatsapp: '#1eb757',
          premium: '#7c3aed',
        },
        surface: {
          canvas: 'var(--color-surface-canvas)',
          surface: 'var(--color-surface-surface)',
          cards: 'var(--color-surface-cards)',
          elevated: 'var(--color-surface-elevated)',
          foreground: 'var(--color-surface-foreground)',
          fgMuted: 'var(--color-surface-fg-muted)',
          fgSubtle: 'var(--color-surface-fg-subtle)',
          fgInverse: 'var(--color-surface-fg-inverse)',
        },
        text: {
          heading: 'var(--color-text-heading)',
          hero: 'var(--color-text-hero)',
          body: 'var(--color-text-body)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
          brand: 'var(--color-text-brand)',
          inverse: 'var(--color-text-inverse)',
        },
        line: {
          default: 'var(--color-line-default)',
          subtle: 'var(--color-line-subtle)',
          strong: 'var(--color-line-strong)',
          inverse: 'var(--color-line-inverse)',
        },
        state: {
          layout: 'var(--color-state-layout)',
          glow: 'var(--color-state-glow)',
          overlay: 'var(--color-state-overlay)',
          dots: 'var(--color-state-dots)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bricolage)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(2, 132, 199, 0.35)',
        'glow-secondary': '0 0 20px rgba(56, 189, 248, 0.2)',
        'card-subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-elevated': '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
