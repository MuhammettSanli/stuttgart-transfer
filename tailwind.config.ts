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
        // Deep midnight navy + warm gold — a premium chauffeur palette.
        midnight: '#081625',
        brand: {
          DEFAULT: '#0B1F3A',
          light: '#13314f',
          dark: '#081625',
        },
        gold: {
          DEFAULT: '#C6A15B',
          light: '#E3C888',
          dark: '#A9842F',
        },
        ivory: '#F5F1E9',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      container: {
        center: true,
        padding: '1.25rem',
        screens: {
          '2xl': '1240px',
        },
      },
      boxShadow: {
        elevated: '0 30px 60px -20px rgba(8, 22, 37, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
