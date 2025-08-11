import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class', // Enable dark mode using the 'dark' class
  theme: {
    extend: {
      colors: {
        primary: '#24AE7C',
        secondary: '#79B5EC',
      },
    },
  },
  plugins: [],
};

export default config;