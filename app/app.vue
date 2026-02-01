<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const { locale } = useI18n()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

// const title = 'Sumaq CMS - Starter Version'
// const description = 'A Nuxt UI template to kickstart Sumaq CMS project.'

// useSeoMeta({
//   title,
//   description,
//   ogTitle: title,
//   ogDescription: description,
//   ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
//   twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
//   twitterCard: 'summary_large_image'
// })
</script>
