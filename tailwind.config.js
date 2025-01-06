/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fontPrimary: "var(--font-primary)",
        fontSecondary: "var(--font-secondary)"
      },
      fontFamily: {
        britti: ['"Britti Sans"']
      }
    },
  },
  plugins: [],
}

