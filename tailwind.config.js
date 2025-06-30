/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
  safelist: [
    // Color variants for dynamic classes
    'bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-purple-600', 'bg-orange-600', 'bg-yellow-600',
    'hover:bg-blue-700', 'hover:bg-green-700', 'hover:bg-red-700', 'hover:bg-purple-700', 'hover:bg-orange-700', 'hover:bg-yellow-700',
    'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 'text-orange-400', 'text-yellow-400',
    'border-blue-500', 'border-green-500', 'border-red-500', 'border-purple-500', 'border-orange-500', 'border-yellow-500',
    'from-blue-600', 'from-green-600', 'from-red-600', 'from-purple-600', 'from-orange-600', 'from-yellow-600',
    'to-blue-700', 'to-green-700', 'to-red-700', 'to-purple-700', 'to-orange-700', 'to-yellow-700',
    // Priority colors for advice system
    'bg-red-900', 'bg-orange-900', 'bg-yellow-900', 'bg-green-900',
    'text-red-200', 'text-orange-200', 'text-yellow-200', 'text-green-200',
    'border-red-600', 'border-orange-600', 'border-yellow-600', 'border-green-600',
  ],
}