/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'somnia-primary': '#6366f1',
        'somnia-secondary': '#8b5cf6',
        'somnia-accent': '#06b6d4',
      },
    },
  },
  plugins: [],
}