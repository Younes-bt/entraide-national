/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: '#f3f3f3',
        white: '#ffffff',
        green: '#b0d273',
        purple: '#653171',
        'light-blue': '#39b1da',
        blue: '#0069b6',
        // Dark mode colors (use with dark: prefix)
        'dark-background': '#0d0d0d',
        'light-dark': '#141414',
        'light-white': '#fffefe',
        'dark-green': '#0d492a',
        'dark-purple': '#2b0051',
        gray: '#262727',
      },
    },
  },
  plugins: [],
} 