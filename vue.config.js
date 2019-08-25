module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/sheiley_shop/'
    : '/',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
