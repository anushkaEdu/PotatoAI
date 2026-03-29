/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0F1A0F',
        forest: '#2D5A1B',
        leaf: '#7CB518',
        earth: '#8B5E3C',
        text: '#E8F5E0',
        danger: '#C0392B',
        warning: '#E67E22',
        healthy: '#27AE60'
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
