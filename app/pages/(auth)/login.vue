<template>
  <UContainer class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            Iniciar Sesión
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>
      </template>

      <UAuthForm
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :schema="schema"
        :fields="fields"
        :submit-button="{
          label: 'Iniciar Sesión',
          trailingIcon: 'i-heroicons-arrow-right-20-solid'
        }"
        @submit="handleLogin"
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

        <!-- <template #footer>
          <div class="text-center text-sm">
            <UButton
              variant="link"
              to="/forgot-password"
              class="text-primary"
            >
              ¿Olvidaste tu contraseña?
            </UButton>
          </div>
        </template> -->
      </UAuthForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const router = useRouter()

const fields: AuthFormField [] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'tu@email.com',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    placeholder: 'Ingresa tu contraseña',
    required: true
  },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox'
  }
]
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const handleLogin = async (payload: FormSubmitEvent<Schema>) => {
  try {
    console.log(payload)
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: payload.data.email,
        password: payload.data.password
      }
    })

    // Redirect to dashboard
    await router.push('/dashboard')
  } catch (error: any) {
    throw new Error(error.data?.message || 'Error al iniciar sesión')
  }
}
</script>
