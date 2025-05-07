/** @type {import('tailwindcss').Config} */

export const content = ['./src/**/*.{js,jsx,ts,tsx}'];
export const theme = {
  extend: {
    colors: {
      'rose-600': '#e11d48',
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
  },
};
export const plugins = [];
