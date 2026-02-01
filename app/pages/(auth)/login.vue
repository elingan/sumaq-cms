<template>
  <UContainer class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <!-- <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            Iniciar Sesión
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>
      </template> -->

      <UAuthForm
        :title="$t('auth.login.title')"
        :description="$t('auth.login.subtitle')"
        icon="i-lucide-user"
        :schema="schema"
        :fields="fields"
        :submit-button="{
          label: $t('auth.login.submitButton'),
          trailingIcon: 'i-heroicons-arrow-right-20-solid'
        }"
        @submit="handleLogin"
      >
        <template #validation>
          <!-- <UAlert
            v-if="state.error"
            color="red"
            variant="soft"
            :title="state.error"
            class="mb-4"
          /> -->
        </template>

        <template #footer>
          <div class="text-center text-sm">
            <UButton
              variant="link"
              to="/forgot-password"
              class="text-primary"
            >
              {{ $t('auth.login.forgotPassword') }}
            </UButton>
          </div>
        </template>
      </UAuthForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const router = useRouter()

const { t } = useI18n()

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: t('form.emailPlaceholder'),
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: t('auth.password'),
    placeholder: t('form.passwordPlaceholder'),
    required: true
  },
  {
    name: 'remember',
    label: t('auth.login.rememberMe'),
    type: 'checkbox'
  }
])
const schema = z.object({
  email: z.string().email(t('validation.invalidEmail')),
  password: z.string().min(1, t('validation.passwordRequired')).min(8, t('validation.minLength', { count: 8 }))
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
    toast.add({
      title: t('auth.login.error'),
      description: error.data?.message || t('auth.login.error'),
      color: 'error'
    })
    throw new Error(error.data?.message || t('auth.login.error'))
  }
}
</script>
