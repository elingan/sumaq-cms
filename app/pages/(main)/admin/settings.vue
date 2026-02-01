<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">
      {{ $t('admin.settings.title') }}
    </h1>

    <!-- GitHub Connection Card -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-github" class="size-5" />
          <h2 class="text-lg font-semibold">
            {{ $t('admin.settings.github.title') }}
          </h2>
        </div>
      </template>

      <!-- Not Connected State -->
      <div v-if="!githubStatus.connected" class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('admin.settings.github.subtitle') }}
        </p>
        <UButton
          color="primary" icon="i-lucide-github"
          :loading="connecting" @click="connectGitHub"
        >
          {{ $t('admin.settings.github.connectButton') }}
        </UButton>
      </div>

      <!-- Connected State -->
      <div v-else class="space-y-4">
        <div class="flex items-center gap-4">
          <UAvatar
            :src="githubStatus.avatarUrl!" :alt="githubStatus.login!"
            size="lg"
          />
          <div>
            <p class="font-semibold">
              {{ $t('admin.settings.github.username', { username: githubStatus.login }) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ githubStatus.accountType }} •
              {{ githubStatus.repositorySelection === 'all' ? $t('admin.settings.github.allRepos') : $t('admin.settings.github.selectedRepos') }}
            </p>
            <p class="text-xs text-gray-400">
              {{ $t('admin.settings.github.connectedOn', { date: $d(new Date(githubStatus.connectedAt!), 'long') }) }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <UButton
            color="neutral" variant="soft"
            to="/admin/github/repos"
          >
            {{ $t('admin.settings.github.viewRepos') }}
          </UButton>
          <UButton
            variant="soft" target="_blank"
            to="https://github.com/settings/installations" external
          >
            {{ $t('admin.settings.github.configureAccess') }}
          </UButton>
          <UButton
            color="red" variant="soft"
            :loading="disconnecting" @click="disconnectGitHub"
          >
            {{ $t('admin.settings.github.disconnect') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'main'
})

const connecting = ref(false)
const disconnecting = ref(false)
const githubStatus = ref<GitHubConnectionStatus>({
  connected: false,
  login: null,
  avatarUrl: null,
  connectedAt: null,
  accountType: null,
  repositorySelection: null
})

// Fetch status on mount
onMounted(async () => {
  const data = await $fetch<GitHubConnectionStatus>('/api/github/status')
  githubStatus.value = data

  // Check URL params for success message
  const route = useRoute()
  if (route.query.github === 'connected') {
    // Could add a toast notification here
    console.log('GitHub connected successfully!')
  }
})

const connectGitHub = () => {
  connecting.value = true
  window.location.href = '/api/github/connect'
}

const disconnectGitHub = async () => {
  disconnecting.value = true
  try {
    await $fetch('/api/github/disconnect', { method: 'POST' })
    githubStatus.value = {
      connected: false,
      login: null,
      avatarUrl: null,
      connectedAt: null
    }
  } catch (error) {
    console.error('Error disconnecting GitHub:', error)
  } finally {
    disconnecting.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
