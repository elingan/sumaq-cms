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
        :fields="fields"
        :submit-button="{
          label: 'Restablecer Contraseña',
          trailingIcon: 'i-heroicons-check-20-solid'
        }"
        @submit="handleResetPassword"
      >
        <!-- <template #validation="{ state }">
          <UAlert
            v-if="state.error"
            color="red"
            variant="soft"
            :title="state.error"
            class="mb-4"
          />
        </template> -->
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
import * as z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const route = useRoute()
const token = route.query.token as string

const fields: AuthFormField [] = [
  {
    name: 'password',
    type: 'password',
    label: 'Nueva Contraseña',
    placeholder: 'Ingresa tu nueva contraseña',
    required: true
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirmar Contraseña',
    placeholder: 'Confirma tu nueva contraseña',
    required: true
  }
]

const schema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La confirmación de la contraseña debe tener al menos 6 caracteres')
})

type Schema = z.output<typeof schema>

const success = ref(false)

if (!token) {
  navigateTo('/login')
}

const handleResetPassword = async (payload: FormSubmitEvent<Schema>) => {
  if (payload.data.password !== payload.data.confirmPassword) {
    throw new Error('Las contraseñas no coinciden')
  }

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        password: payload.data.password
      }
    })
    toast.add({
      title: 'Éxito',
      description: 'Tu contraseña ha sido restablecida exitosamente.',
      color: 'success'
    })

    success.value = true
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Error al restablecer la contraseña',
      color: 'error'
    })
    throw new Error(error.data?.message || 'Error al restablecer la contraseña')
  }
}
</script>
