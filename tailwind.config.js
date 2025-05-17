/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,jsx,ts,tsx}'];
export const theme = {
  extend: {
    colors: {
      'rose-600': '#e11d48',
      'rose-700': '#be123c', // Darker shade for gradients
      'gray-50': '#f9fafb',
      'gray-100': '#e5e7eb',
    },
    keyframes: {
      'fade-in': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      'fade-in-delay': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },
    animation: {
      'fade-in': 'fade-in 0.8s ease-out',
      'fade-in-delay': 'fade-in-delay 0.8s ease-out 0.3s',
    },
    boxShadow: {
      glow: '0 0 8px rgba(225, 29, 72, 0.5)', // Matches rose-600
    },
    textShadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
      md: '0 2px 4px rgba(0, 0, 0, 0.6)',
    },
  },
};
export const plugins = [
  function ({ addUtilities }) {
    addUtilities({
      '.text-shadow-sm': {
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      },
      '.text-shadow-md': {
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
      },
    });
  },
];
