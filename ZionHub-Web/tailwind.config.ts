import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0A2E3D',
          800: '#1E5F74',
          700: '#2A7A8E',
          600: '#3795A8',
          500: '#4CA89A',
          400: '#62BDA8',
          300: '#7FD8BE',
          200: '#A8E8D4',
          100: '#D1F4E9',
          50: '#E8F6F3',
        },
        success: {
          600: '#16A34A',
          500: '#22C55E',
          100: '#DCFCE7',
        },
        warning: {
          600: '#EA580C',
          500: '#F97316',
          100: '#FFEDD5',
        },
        error: {
          600: '#DC2626',
          500: '#EF4444',
          100: '#FEE2E2',
        },
        gray: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundColor: {
        background: '#F5F7FA',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
