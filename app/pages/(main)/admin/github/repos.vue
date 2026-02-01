<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          {{ $t('admin.github.repos.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('admin.github.repos.subtitle') }}
        </p>
      </div>
      <div
        v-if="data?.github"
        class="flex items-center gap-2"
      >
        <UAvatar
          :src="data.github.avatarUrl"
          :alt="data.github.login"
          size="sm"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('admin.settings.github.username', { username: data.github.login }) }}</span>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="flex gap-4">
      <UInput
        v-model="search"
        :placeholder="$t('admin.github.repos.searchPlaceholder')"
        icon="i-lucide-search"
        class="flex-1"
      />
      <USelect
        v-model="filter"
        :options="filterOptions"
        :placeholder="$t('common.filter')"
      />
    </div>

    <!-- Repos List -->
    <div
      v-if="pending"
      class="space-y-4"
    >
      <USkeleton
        v-for="i in 5"
        :key="i"
        class="h-24"
      />
    </div>

    <div
      v-else-if="filteredRepos.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-folder-git"
        class="size-12 text-gray-400 mx-auto"
      />
      <p class="mt-4 text-gray-500 dark:text-gray-400">
        {{ $t('admin.github.repos.noReposFound') }}
      </p>
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <UCard
        v-for="repo in filteredRepos"
        :key="repo.id"
        class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <UIcon
                :name="repo.private ? 'i-lucide-lock' : 'i-lucide-globe'"
                :class="repo.private ? 'text-yellow-500' : 'text-green-500'"
              />
              <h3 class="font-semibold">
                {{ repo.name }}
              </h3>
              <UBadge
                v-if="repo.language"
                variant="soft"
                size="sm"
              >
                {{ repo.language }}
              </UBadge>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ repo.description || $t('admin.github.repos.noDescription') }}
            </p>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-1">
                <UIcon
                  name="i-lucide-star"
                  class="size-3"
                />
                {{ $tc('plurals.star', repo.stars, { n: repo.stars }) }}
              </span>
              <span>
                {{ $t('time.updatedOn', { date: formatDate(repo.updatedAt) }) }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <UButton
              variant="soft"
              size="sm"
              icon="i-lucide-external-link"
              :to="repo.url"
              target="_blank"
            >
              {{ $t('admin.github.repos.viewOnGithub') }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

const { t, tc } = useI18n()

const search = ref('')
const filter = ref('all')
const filterOptions = computed(() => [
  { label: t('admin.github.repos.filterAll'), value: 'all' },
  { label: t('admin.github.repos.filterPublic'), value: 'public' },
  { label: t('admin.github.repos.filterPrivate'), value: 'private' }
])

const { data, pending } = await useFetch('/api/github/repos', {
  query: {
    per_page: 100,
    sort: 'updated'
  }
})

const filteredRepos = computed(() => {
  if (!data.value?.repos) return []

  let repos = data.value.repos

  // Apply search
  if (search.value) {
    repos = repos.filter(repo =>
      repo.name.toLowerCase().includes(search.value.toLowerCase())
      || repo.description?.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // Apply filter
  if (filter.value === 'public') {
    repos = repos.filter(repo => !repo.private)
  } else if (filter.value === 'private') {
    repos = repos.filter(repo => repo.private)
  }

  return repos
})

const formatDate = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return t('time.today')
  if (diffDays === 1) return t('time.yesterday')
  if (diffDays < 30) return tc('time.daysAgo', diffDays, { n: diffDays })

  return date.toLocaleDateString()
}
</script>
