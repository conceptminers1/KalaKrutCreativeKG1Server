
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif']
      },
      colors: {
        kala: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          accent: '#8b5cf6',
          secondary: '#06b6d4'
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
