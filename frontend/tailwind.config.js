/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'youtube-red': '#FF0000',
        'youtube-dark': '#282828',
        'youtube-gray': '#303030',
        'youtube-light-gray': '#F9F9F9',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
