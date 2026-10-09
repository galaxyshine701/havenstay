/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // CLAUDE.md type scale: 12 / 14 / 16 / 20 / 24 / 32 / 48. Nothing else exists,
    // so classes like text-lg or text-4xl silently do nothing. Do not use them.
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    extend: {
      colors: {
        haven: {
          50: '#F3F7F5',
          700: '#1F5148',
          900: '#10302B',
        },
        sand: {
          100: '#FAF6EE',
        },
        gold: {
          500: '#B8893B',
        },
        ink: {
          500: '#5F6B68',
          900: '#1B1F1E',
        },
        success: '#2E7D5B',
        danger: '#B3261E',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
