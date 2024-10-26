/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        pokemon: ["pokemon", "sans-serif"],
      },
    },
  },
  plugins: [],
}

