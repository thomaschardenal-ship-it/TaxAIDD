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
        omni: {
          yellow: '#FFB800',
          'yellow-dark': '#F5A623',
          magenta: '#E91E8C',
          'magenta-light': '#F5A5D5',
          mint: '#00D4AA',
          'mint-light': '#7FFFD4',
          blue: '#0033A0',
          'blue-light': '#9BB4D9',
          purple: '#6B00E0',
          'purple-light': '#C4B5FD',
          black: '#2D2D2D',
          gray: '#C0C0C0',
          'gray-light': '#F8F8F8',
          'gray-lighter': '#F3F3F3',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
