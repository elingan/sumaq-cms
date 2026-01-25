<template>
  <div class="flex min-h-screen items-center justify-center">
    <div v-if="!isLoaded" class="text-center">
      <p class="text-gray-600 dark:text-gray-400">
        Cargando...
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { isSignedIn, isLoaded } = useAuth()

// Redirigir automáticamente según el estado de autenticación
watch([isLoaded, isSignedIn], ([loaded, signedIn]) => {
  if (loaded) {
    if (signedIn) {
      navigateTo('/dashboard')
    } else {
      navigateTo('/login')
    }
  }
}, { immediate: true })
</script>

