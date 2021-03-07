module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#0d2a72'
        },
        purple: {
          300: '#b61c8a',
          500: '#8c0d68',
          DEFAULT: '#a01077'
        },
        aqua: {
          300: '#6dcece',
          500: '#49b0b0',
          DEFAULT: '#54b5b5'
        },
        yellow: {
          700: '#cc830e',
          DEFAULT: '#ffc600'
        },
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  // purge: {
  //   enabled: true,
  //   content: [
  //     './**/*.html'
  //   ]
  // }
}
