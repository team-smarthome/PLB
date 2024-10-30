/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'translate-x-0',
    'translate-x-6',
  ],
  theme: {
    extend: {
      colors: {
        'btnPrimary': "#11375c"
      }
    },
  },
  plugins: [],
}

