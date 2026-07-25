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
        // "Engineered precision" palette — paper, graphite ink, one signal accent.
        paper: '#F4F3EF',
        ink: { DEFAULT: '#17181B', soft: '#2A2C30' },
        graphite: '#5B5E63',
        line: '#E3E1DA',
        signal: { DEFAULT: '#DD5A2A', light: '#E9744A', dark: '#B8461E' },

        // Legacy semantic aliases (kept so inner pages stay coherent under the new palette)
        brand: { DEFAULT: '#17181B', light: '#2A2C30', dark: '#0F1012' },
        gold: { DEFAULT: '#DD5A2A', light: '#E9744A', dark: '#B8461E' },
        ivory: '#F4F3EF',
        midnight: '#0F1012',
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
