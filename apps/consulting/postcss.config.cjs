const { join } = require('path')

// vanilla-cookieconsent sizes its banner in rem against a 16px root, but our
// <html> is 62.5% (10px) -- scale its rem values up so it renders as designed.
const scaleCookieConsentRem = {
  postcssPlugin: 'scale-cookieconsent-rem',
  Once(root) {
    if (!root.source?.input.file?.includes('vanilla-cookieconsent')) return
    root.walkDecls((decl) => {
      decl.value = decl.value.replace(
        /(\d*\.?\d+)rem\b/g,
        (_, n) => `${+(n * 1.6).toFixed(4)}rem`,
      )
    })
  },
}

module.exports = {
  plugins: [
    require('tailwindcss')({ config: join(__dirname, 'tailwind.config.cjs') }),
    require('autoprefixer'),
    scaleCookieConsentRem,
  ],
}
