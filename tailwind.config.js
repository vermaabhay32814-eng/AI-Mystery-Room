/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#090a0f',
          900: '#0e1117',
          850: '#131722',
          800: '#1a1f2c',
          700: '#262d3d',
          600: '#384259',
          500: '#4e5b78',
          400: '#7583a3',
          300: '#9faec7',
          200: '#cdd7e8',
          100: '#eef2f9',
          50: '#f8fafc'
        },
        detective: {
          amber: '#d97706',
          gold: '#f59e0b',
          crimson: '#dc2626',
          emerald: '#10b981',
          teal: '#0d9488',
          cyan: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
