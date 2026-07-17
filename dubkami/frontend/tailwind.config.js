/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          500: '#4c6ef5',
          700: '#3451c7',
          900: '#1d2f8a',
        },
      },
    },
  },
  plugins: [],
};
