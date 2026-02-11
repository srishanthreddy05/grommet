/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      colors: {
        grommetBg: "#FEF7EF",
        primaryText: "#111827",
        secondaryText: "#374151",
        badgeRed: "#991B1B",
        accentBrown: "#8B5E3C",
      },
    },
  },
  plugins: [],
};
