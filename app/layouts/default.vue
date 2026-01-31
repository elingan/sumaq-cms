<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <!-- <div v-if="!loggedIn">
          <UButton
            to="/login" color="primary"
            variant="soft"
          >
            Iniciar Sesión
          </UButton>
        </div> -->

        <!-- <UDropdownMenu
          v-else :items="userMenuItems"
          class="ml-2"
        >
          <UAvatar
            :text="user?.name || user?.email || 'U'"
            size="sm"
            class="cursor-pointer"
          />
        </UDropdownMenu> -->
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <p>Sumaq Sites</p>
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
// const { loggedIn, user } = useUserSession()
// const router = useRouter()

// const userMenuItems = computed(() => [
//   [{
//     label: user.value?.email || '',
//     slot: 'account',
//     disabled: true
//   }],
//   [{
//     label: 'Dashboard',
//     icon: 'i-heroicons-home',
//     click: () => router.push('/dashboard')
//   }, {
//     label: 'Settings',
//     icon: 'i-heroicons-cog-6-tooth',
//     click: () => router.push('/settings')
//   }],
//   [{
//     label: 'Logout',
//     icon: 'i-heroicons-arrow-right-on-rectangle',
//     click: async () => {
//       await $fetch('/api/auth/logout', { method: 'POST' })
//       await router.push('/login')
//     }
//   }]
// ])
</script>
