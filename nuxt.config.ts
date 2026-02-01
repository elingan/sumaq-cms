// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/a11y',
    '@nuxt/image',
    '@nuxt/hints',
    '@nuxt/test-utils',
    'nuxt-auth-utils',
    '@nuxthub/core',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'es',
        language: 'es-ES',
        name: 'Español',
        file: 'es.json'
      },
      {
        code: 'de',
        language: 'de-DE',
        name: 'Deutsch',
        file: 'de.json'
      }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    },
    lazy: true,
    langDir: 'locales',
    vueI18n: './i18n.config.ts'
  },

  $production: {
    hub: {
      db: {
        dialect: 'postgresql',
        driver: 'neon-http'
      },
      blob: {
        driver: 'vercel-blob'
      }
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  hub: {
    db: {
      dialect: 'postgresql',
      casing: 'snake_case'
    },
    blob: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
