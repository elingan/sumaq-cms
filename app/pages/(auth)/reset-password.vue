<template>
  <UContainer class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            {{ $t('auth.resetPassword.title') }}
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ $t('auth.resetPassword.subtitle') }}
          </p>
        </div>
      </template>

      <UAuthForm
        v-if="!success"
        :fields="fields"
        :submit-button="{
          label: $t('auth.resetPassword.submitButton'),
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
          :title="$t('auth.resetPassword.successTitle')"
          :description="$t('auth.resetPassword.successMessage')"
          class="mb-4"
        />
        <UButton
          to="/login" variant="solid"
          class="mt-4"
        >
          {{ $t('auth.resetPassword.loginButton') }}
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

const { t } = useI18n()

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'password',
    type: 'password',
    label: t('auth.newPassword'),
    placeholder: t('form.newPasswordPlaceholder'),
    required: true
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: t('auth.confirmPassword'),
    placeholder: t('form.confirmPasswordPlaceholder'),
    required: true
  }
])

const schema = z.object({
  password: z.string().min(6, t('validation.minPasswordLength', { count: 6 })),
  confirmPassword: z.string().min(6, t('validation.minConfirmPasswordLength', { count: 6 }))
})

type Schema = z.output<typeof schema>

const success = ref(false)

if (!token) {
  navigateTo('/login')
}

const handleResetPassword = async (payload: FormSubmitEvent<Schema>) => {
  if (payload.data.password !== payload.data.confirmPassword) {
    throw new Error(t('validation.passwordsMismatch'))
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
      title: t('status.success'),
      description: t('auth.resetPassword.successMessage'),
      color: 'success'
    })

    success.value = true
  } catch (error: any) {
    toast.add({
      title: t('status.error'),
      description: error.data?.message || t('auth.resetPassword.errorMessage'),
      color: 'error'
    })
    throw new Error(error.data?.message || t('auth.resetPassword.errorMessage'))
  }
}
</script>
