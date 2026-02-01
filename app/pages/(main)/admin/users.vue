<script setup lang="ts">
definePageMeta({
  layout: 'main',
  // middleware: ['auth'] // auth.global.ts ya maneja esto
})

const { t, tc } = useI18n()

const { data: users, status, error } = await useFetch('/api/admin/users')

// const columns = [
//   { id: 'avatar', key: 'avatar', label: '' },
//   { id: 'info', key: 'info', label: 'User' },
//   { id: 'role', key: 'role', label: 'Role' },
//   { id: 'lastSignInAt', key: 'lastSignInAt', label: 'Last Login' },
//   { id: 'createdAt', key: 'createdAt', label: 'Joined' }
// ]

const items = computed(() => {
  if (!users.value) return []

  return users.value.map((user: any) => ({
    id: user.id,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.firstName ? `${user.firstName} ${user.lastName || ''}` : t('common.noName'),
    email: user.emailAddresses.find((e: any) => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0]?.emailAddress,
    role: user.publicMetadata?.role || 'owner', // Default to owner as per requirements
    lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : t('common.never'),
    createdAt: new Date(user.createdAt).toLocaleDateString()
  }))
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ $t('admin.users.title') }}</h1>
      <UBadge color="primary" variant="soft">{{ $tc('plurals.user', items.length, { count: items.length }) }}</UBadge>
    </div>

    <UCard v-if="error" class="mb-4" >
        <template #header>
         <div class="text-red-500 font-bold">
            {{ $t('admin.users.accessDenied') }}
        </div>
        </template>
      <div class="text-red-500">
        {{ error.statusCode === 403 ? $t('admin.users.accessDeniedMessage') : error.message }}
      </div>
    </UCard>

    <UTable
      :data="items"
      :loading="status === 'pending'"
    >
      <template #avatar-data="{ row }">
        <UAvatar :src="row.imageUrl" :alt="row.displayName" size="sm" />
      </template>

      <template #info-data="{ row }">
        <div class="flex flex-col">
          <span class="font-medium text-gray-900 dark:text-white">{{ row.displayName }}</span>
          <span class="text-gray-500 text-sm">{{ row.email }}</span>
        </div>
      </template>

      <template #role-data="{ row }">
        <UBadge
          :color="row.role === 'admin' ? 'red' : row.role === 'owner' ? 'green' : 'gray'"
          variant="subtle"
        >
          {{ row.role }}
        </UBadge>
      </template>
    </UTable>
  </div>
</template>
