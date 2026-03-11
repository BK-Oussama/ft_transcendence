/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // The ** tells Tailwind to scan ALL subfolders
  ],
  theme: {
    extend: {
      // Re-adding the boards dev's specific brand colors if needed
      colors: {
        'sidebar-dark': '#e60d67',
      }
    },
  },
  plugins: [],
}