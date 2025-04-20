/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neon accent color similar to the Wizard2 design
        neon: {
          50: '#eafff2',
          100: '#d0fae0',
          200: '#a6f4c0',
          300: '#6aeb94',
          400: '#36de6c',
          500: '#12bf4a',
          600: '#0d9c3b',
          700: '#107a33',
          800: '#12602c',
          900: '#114f28',
        },
        midnight: {
          50: '#f4f6fa',
          100: '#e8ecf4',
          200: '#cad5e7',
          300: '#9baed1',
          400: '#6785b5',
          500: '#476999',
          600: '#36517b',
          700: '#2c4264',
          800: '#273953',
          900: '#192136',
          950: '#111827',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        neon: '0 0 10px rgba(54, 222, 108, 0.5), 0 0 20px rgba(54, 222, 108, 0.3)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        hover: '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
