module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#0d2a72'
        },
        purple: {
          DEFAULT: '#a01077'
        },
        aqua: {
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
