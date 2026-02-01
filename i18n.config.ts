export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',

  // Pluralization rules
  pluralRules: {
    en: (choice: number) => {
      if (choice === 0) return 0
      if (choice === 1) return 1
      return 2
    },
    es: (choice: number) => {
      if (choice === 0) return 0
      if (choice === 1) return 1
      return 2
    },
    de: (choice: number) => {
      if (choice === 0) return 0
      if (choice === 1) return 1
      return 2
    }
  },

  // Date/time formats (DD.MM.YYYY format)
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      },
      time: {
        hour: '2-digit',
        minute: '2-digit'
      }
    },
    es: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      },
      time: {
        hour: '2-digit',
        minute: '2-digit'
      }
    },
    de: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      },
      time: {
        hour: '2-digit',
        minute: '2-digit'
      }
    }
  },

  // Number formats
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    },
    es: {
      currency: {
        style: 'currency',
        currency: 'EUR'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    },
    de: {
      currency: {
        style: 'currency',
        currency: 'EUR'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    }
  }
}))
