<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido a Sumaq CMS
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Inicia sesión para continuar
        </p>
      </div>

      <SignIn />
    </div>
  </div>
</template>

<script lang="ts" setup>
// El componente SignIn se importa automáticamente desde @clerk/nuxt
// Redirige automáticamente a /dashboard después del login (configurado en .env)
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
