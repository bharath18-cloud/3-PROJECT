/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#2d435e',
          DEFAULT: '#1F3147',
          dark: '#121e2d'
        },
        teal: {
          light: '#05aab5',
          DEFAULT: '#008C95',
          dark: '#006a71'
        },
        gold: {
          light: '#f5c645',
          DEFAULT: '#D4A017',
          dark: '#a87c0d'
        },
        lightBg: '#F8F8F8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        premium: '0 10px 30px -10px rgba(31, 49, 71, 0.1)',
        glow: '0 0 15px rgba(0, 140, 149, 0.25)',
      }
    },
  },
  plugins: [],
}
