/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en', 'hi', 'ar', 'zh', 'es', 'fr', 'de', 'pt', 'ru',
      'ja', 'ko', 'it', 'nl', 'pl', 'tr', 'sv', 'he', 'ur',
    ],
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
