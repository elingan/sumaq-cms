<template>
  <UContainer class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            Recuperar Contraseña
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña
          </p>
        </div>
      </template>

      <UAuthForm
        v-if="!submitted"
        :fields="[
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'tu@email.com'
          }
        ]"
        :providers="[]"
        :submit-button="{
          label: 'Enviar Enlace',
          trailingIcon: 'i-heroicons-paper-airplane-20-solid'
        }"
        @submit="handleForgotPassword"
      >
        <template #validation="{ state }">
          <UAlert
            v-if="state.error"
            color="red"
            variant="soft"
            :title="state.error"
            class="mb-4"
          />
        </template>

        <template #footer>
          <div class="text-center text-sm">
            <UButton
              variant="link"
              to="/login"
              class="text-primary"
            >
              Volver al inicio de sesión
            </UButton>
          </div>
        </template>
      </UAuthForm>

      <div v-else class="text-center">
        <UAlert
          color="green"
          variant="soft"
          title="¡Enlace enviado!"
          description="Si existe una cuenta con ese email, recibirás un enlace para recuperar tu contraseña."
          class="mb-4"
        />
        <UButton
          to="/login" variant="outline"
          class="mt-4"
        >
          Volver al inicio de sesión
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const submitted = ref(false)

const handleForgotPassword = async (state: { email: string }) => {
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: state.email
      }
    })

    submitted.value = true
  } catch (error: any) {
    throw new Error(error.data?.message || 'Error al enviar el enlace')
  }
}
</script>
