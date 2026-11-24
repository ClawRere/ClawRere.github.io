/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Claude Inspired Warm Palette
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F4EEE5',
          300: '#EAE1D3',
          400: '#DCCDB9',
          500: '#CBB49C',
        },
        terracotta: {
          DEFAULT: '#D97757',
          50: '#FAF0ED',
          100: '#F5E1DB',
          200: '#ECC3B7',
          300: '#E3A593',
          400: '#D97757',
          500: '#C65F3F',
          600: '#A44B30',
        },
        charcoal: {
          DEFAULT: '#1F1E1D',
          50: '#8E8D8A',
          100: '#686663',
          200: '#4D4B49',
          300: '#383634',
          400: '#282725',
          500: '#1F1E1D',
          900: '#141413',
        },
        obsidian: {
          DEFAULT: '#141413',
          card: '#1C1B1A',
          border: '#292826',
          hover: '#242321',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'apple-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow-terracotta': '0 0 25px -5px rgba(217, 119, 87, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
