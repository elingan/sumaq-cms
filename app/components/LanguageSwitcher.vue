<template>
  <USelectMenu
    v-model="selectedLocale"
    :options="availableLocales"
    option-attribute="name"
    value-attribute="code"
    @update:model-value="changeLocale"
  >
    <template #label>
      <UIcon name="i-heroicons-language" class="mr-2" />
      {{ currentLocaleName }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value)

const selectedLocale = ref(locale.value)

const currentLocaleName = computed(() => {
  return locales.value.find(l => l.code === locale.value)?.name || 'English'
})

const changeLocale = async (newLocale: string) => {
  await setLocale(newLocale)
  selectedLocale.value = newLocale

  // Persist to localStorage
  if (import.meta.client) {
    localStorage.setItem('i18n_locale', newLocale)
  }
}

// Sync with external locale changes
watch(locale, (newLocale) => {
  selectedLocale.value = newLocale
})
</script>
