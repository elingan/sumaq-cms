<template>
  <UContainer class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            {{ $t('auth.forgotPassword.title') }}
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ $t('auth.forgotPassword.subtitle') }}
          </p>
        </div>
      </template>

      <UAuthForm
        v-if="!submitted"
        :fields="fields"
        :schema="schema"
        :submit-button="{
          label: $t('auth.forgotPassword.submitButton'),
          trailingIcon: 'i-heroicons-paper-airplane-20-solid'
        }"
        @submit="handleForgotPassword"
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

        <template #footer>
          <div class="text-center text-sm">
            <UButton
              variant="link"
              to="/login"
              class="text-primary"
            >
              {{ $t('auth.forgotPassword.backToLogin') }}
            </UButton>
          </div>
        </template>
      </UAuthForm>

      <div v-else class="text-center">
        <UAlert
          color="green"
          variant="soft"
          :title="$t('auth.forgotPassword.successTitle')"
          :description="$t('auth.forgotPassword.successMessage')"
          class="mb-4"
        />
        <UButton
          to="/login" variant="outline"
          class="mt-4"
        >
          {{ $t('auth.forgotPassword.backToLogin') }}
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const { t } = useI18n()

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: t('form.emailPlaceholder')
  }
])

const schema = z.object({
  email: z.string().email(t('validation.invalidEmail'))
})

type Schema = z.output<typeof schema>

const submitted = ref(false)

const handleForgotPassword = async (payload: FormSubmitEvent<Schema>) => {
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: payload.data.email
      }
    })
    toast.add({
      title: t('status.success'),
      description: t('auth.forgotPassword.successMessage'),
      color: 'success'
    })

    submitted.value = true
  } catch (error: any) {
    toast.add({
      title: t('status.error'),
      description: error.data?.message || t('auth.forgotPassword.errorMessage'),
      color: 'error'
    })
    throw new Error(error.data?.message || t('auth.forgotPassword.errorMessage'))
  }
}
</script>
