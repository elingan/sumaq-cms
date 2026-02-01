export const useUserPreferencesStore = defineStore('userPreferences', () => {
    const { locale, setLocale } = useI18n()

    // Load preferences from localStorage on init
    const loadPreferences = () => {
        if (import.meta.client) {
            const savedLocale = localStorage.getItem('i18n_locale')
            if (savedLocale && savedLocale !== locale.value) {
                setLocale(savedLocale)
            }
        }
    }

    // Save locale to localStorage
    const saveLocale = (newLocale: string) => {
        setLocale(newLocale)
        if (import.meta.client) {
            localStorage.setItem('i18n_locale', newLocale)
        }
    }

    return {
        locale,
        loadPreferences,
        saveLocale
    }
})
