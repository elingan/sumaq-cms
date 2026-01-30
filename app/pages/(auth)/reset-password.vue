<template>
  <UContainer class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            Nueva Contraseña
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingresa tu nueva contraseña
          </p>
        </div>
      </template>

      <UAuthForm
        v-if="!success"
        :fields="[
          {
            name: 'password',
            type: 'password',
            label: 'Nueva Contraseña',
            placeholder: 'Ingresa tu nueva contraseña'
          },
          {
            name: 'confirmPassword',
            type: 'password',
            label: 'Confirmar Contraseña',
            placeholder: 'Confirma tu nueva contraseña'
          }
        ]"
        :providers="[]"
        :submit-button="{
          label: 'Restablecer Contraseña',
          trailingIcon: 'i-heroicons-check-20-solid'
        }"
        @submit="handleResetPassword"
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
      </UAuthForm>

      <div v-else class="text-center">
        <UAlert
          color="green"
          variant="soft"
          title="¡Contraseña restablecida!"
          description="Tu contraseña ha sido actualizada exitosamente."
          class="mb-4"
        />
        <UButton
          to="/login" variant="solid"
          class="mt-4"
        >
          Iniciar Sesión
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

const route = useRoute()
const token = route.query.token as string

const success = ref(false)

if (!token) {
  navigateTo('/login')
}

const handleResetPassword = async (state: { password: string, confirmPassword: string }) => {
  if (state.password !== state.confirmPassword) {
    throw new Error('Las contraseñas no coinciden')
  }

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        password: state.password
      }
    })

    success.value = true
  } catch (error: any) {
    throw new Error(error.data?.message || 'Error al restablecer la contraseña')
  }
}
</script>
