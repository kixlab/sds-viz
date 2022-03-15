// tailwind.config.js

const colors = require('tailwindcss/colors')

module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '9/20': '45%',
        '11/20': '55%',
      }
    },
    colors
  },
  
  variants: {
    extend: {},
  },
  plugins: [],
}