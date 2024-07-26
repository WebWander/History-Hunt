/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'purple-bright':'#FF32FF',
        'blue':'#80B3FF',
        'purple-soft':'#BE3CFB',
        'orange':'#FFAA2D'
      },
      fontFamily: {
        'system': ['System'],
      }
    },
  },
  plugins: [],
}
