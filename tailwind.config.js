/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Outfit', 'sans-serif'],
    },
    extend: {},
  },
  daisyui: {
    themes: ['bumblebee'],
  },
  plugins: [
    require('daisyui'),
  ],
}
