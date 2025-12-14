/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        notsro: {
          black: '#0a0a0a',
          charcoal: '#171717',
          gold: '#D4AF37',
          orange: '#EA580C',
          cream: '#F5F5F0',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(234, 88, 12, 0.15)',
      }
    },
  },
  plugins: [],
}