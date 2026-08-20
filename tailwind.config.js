/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brandcolor: {
          50: 'var(--brandcolor-50)',
          100: 'var(--brandcolor-100)',
          200: 'var(--brandcolor-200)',
          500: 'var(--brandcolor-500)',
          700: 'var(--brandcolor-700)',
          900: 'var(--brandcolor-900)',
          warning: 'var(--brandcolor-warning)',
          'warning-soft': 'var(--brandcolor-warning-soft)',
        },
      },
      fontSize: {
        'canvas-ui': ['11px', { lineHeight: '14px' }],
        'canvas-xs': ['10px', { lineHeight: '12px' }],
      },
      boxShadow: {
        token: 'var(--shadow-md)',
      },
      spacing: {
        token: 'var(--space-4)',
      },
    },
  },
  plugins: [],
}
