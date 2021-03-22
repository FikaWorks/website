module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#0d2a72",
        },
        purple: {
          300: "#b61c8a",
          500: "#8c0d68",
          DEFAULT: "#a01077",
        },
        aqua: {
          300: "#6dcece",
          500: "#49b0b0",
          DEFAULT: "#54b5b5",
        },
        yellow: {
          700: "#cc830e",
          DEFAULT: "#ffc600",
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  variants: {
    animation: ["motion-safe"],
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
  purge: {
    enabled: process.env.HUGO_ENV === "production",
    options: {
      // whitelist animation related classes that are injected by javascript
      safelist: ["opacity-0", /^motion-safe/],
    },
    content: ["./**/*.html"],
  },
};
