import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBEF63',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#10B981',
          700: '#059669',
          800: '#047857',
          900: '#065F46'
        },
        secondary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        },
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        maxima: '#A855F7'
      },
      backgroundColor: {
        light: '#F8FAFC',
        'light-secondary': '#F1F5F9',
        'light-tertiary': '#E2E8F0'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)'
      }
    }
  },
  plugins: []
} satisfies Config
