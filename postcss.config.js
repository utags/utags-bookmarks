module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
}
