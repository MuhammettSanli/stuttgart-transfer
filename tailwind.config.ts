import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // "Charcoal + platinum" palette — monochrome tech-luxury, no gold.
        paper: '#F3F2F0',
        ink: { DEFAULT: '#14161A', soft: '#24272C' },
        charcoal: '#0C0D10',
        platinum: { DEFAULT: '#C7CCD4', light: '#E4E6EA', dark: '#9DA3AC' },
        graphite: '#6E7178',
        line: '#E2E1DD',

        // Champagne gold — used sparingly as the single warm spark on the
        // charcoal + platinum base (steel-and-gold, like a fine watch).
        gold: { DEFAULT: '#C8A45C', light: '#DFC489', dark: '#9A7B3A' },
        signal: { DEFAULT: '#C8A45C', light: '#DFC489', dark: '#9A7B3A' },

        // Legacy aliases so inner pages/components stay coherent.
        brand: { DEFAULT: '#14161A', light: '#24272C', dark: '#0C0D10' },
        ivory: '#F3F2F0',
        midnight: '#0C0D10',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.2em',
        mono: '0.08em',
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          '2xl': '1280px',
        },
      },
      boxShadow: {
        panel: '0 1px 0 0 #E3E1DA, 0 24px 48px -28px rgba(23,24,27,0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
