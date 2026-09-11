import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0F',
        surface: '#15151C',
        border: '#2A2A35',
        primary: '#E50914',
      },
    },
  },
  plugins: [],
};
export default config;
