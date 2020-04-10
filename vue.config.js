module.exports = {
  publicPath: (process.env.VUE_APP_ON_ROOT_DIR) ? '/' : '/sheiley_shop/',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
