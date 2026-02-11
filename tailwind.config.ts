import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // WeDD-inspired color palette
        wedd: {
          mint: '#8dd4a0',
          'mint-light': '#b8e5c5',
          'mint-dark': '#6bc48a',
          'mint-50': '#f0faf3',
          black: '#1a1a1a',
          'black-light': '#2d2d2d',
          cream: '#f5f5f0',
          'cream-dark': '#e8e8e3',
          white: '#ffffff',
          'gray-100': '#f8f8f5',
          'gray-200': '#e5e5e0',
          'gray-300': '#d1d1cc',
          'gray-400': '#9c9c97',
          'gray-500': '#6b6b66',
          'gray-600': '#4a4a46',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'wedd': '0px',
      },
    },
  },
  plugins: [],
};
export default config;
