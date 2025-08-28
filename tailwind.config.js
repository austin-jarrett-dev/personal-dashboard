/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          bg: '#0f172a',
          card: '#1e293b',
          cardHover: '#334155',
          accent: '#3b82f6',
          text: '#e2e8f0',
          textMuted: '#94a3b8'
        }
      }
    },
  },
  plugins: [],
}