/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
    "./core/**/*.{js,jsx,ts,tsx}",
    "./infrastructure/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: '#121212',
          darkgray: '#1E1E1E',
          card: '#282828',
          green: '#1DB954',
          'green-hover': '#1ed760',
          white: '#FFFFFF',
          'text-secondary': '#B3B3B3',
          'text-tertiary': '#535353',
        }
      }
    },
  },
  plugins: [],
}