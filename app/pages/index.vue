<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <p class="text-gray-600 dark:text-gray-400">
        Cargando...
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { loggedIn } = useUserSession()

// Redirigir automáticamente según el estado de autenticación
onMounted(() => {
  if (loggedIn.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>
