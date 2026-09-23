/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './**/*.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7', // Base Primary
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
          DEFAULT: '#0284C7',
          primary: '#0284C7',
          'primary-hover': '#0EA5E9',
          'primary-active': '#0369A1',
          accent: '#49A6D7',
          'accent-hover': '#3293C8',
        },
        surface: {
          canvas: '#121211',
          sidebar: '#171716',
          input: '#171716',
          DEFAULT: '#1F1F1E',
          card: '#2C2C2B',
          'card-hover': '#353534',
          popover: '#383837',
          elevated: '#383837',
          highlight: '#454543',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.15)',
          strong: '#4A4A47',
          accent: 'rgba(73, 166, 215, 0.35)',
        },
        feedback: {
          warning: '#FBBF24',
          success: '#4ADE80',
          error: '#F43F5E',
          info: '#38BDF8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #49A6D7 0%, #0284C7 35%, #0369A1 65%, #0C4A6E 85%, #04273E 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 24px -2px rgba(2, 132, 199, 0.45)',
        'glow-accent': '0 0 20px -2px rgba(73, 166, 215, 0.50)',
        'elevation-card': '0 4px 20px rgba(0, 0, 0, 0.45)',
        'elevation-modal': '0 16px 48px rgba(0, 0, 0, 0.65)',
      },
    },
  },
  plugins: [],
}
