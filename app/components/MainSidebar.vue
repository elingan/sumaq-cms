<template>
  <UDashboardSidebar collapsible>
    <template #header="{ collapsed }">
      <AppLogo v-if="!collapsed" class="h-5 w-auto shrink-0" />
      <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" />
    </template>

    <template #footer="{ collapsed }">
      <p v-if="!collapsed" class="text-sm text-muted">
        Sumaq • © {{ new Date().getFullYear() }}
      </p>
      <p v-else class="text-sm text-muted">
        © {{ new Date().getFullYear() }}
      </p>
    </template>
  </UDashboardSidebar>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const { isAdmin } = useRole()

const items = computed(() => {
  const menu: NavigationMenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'i-lucide-house',
      to: '/dashboard'
    },
    {
      label: 'Billing',
      icon: 'i-lucide-credit-card',
      to: '/billing'
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings'
      // defaultOpen: true,
      // children: [
      //   {
      //     label: "General",
      //   },
      //   {
      //     label: "Members",
      //   },
      //   {
      //     label: "Notifications",
      //   },
      // ],
    }
  ]

  if (isAdmin.value) {
    menu.push({
      label: 'Admin',

      icon: 'i-lucide-shield-check',
      defaultOpen: true,
      children: [
        {
          label: 'Users',
          icon: 'i-lucide-users',
          to: '/admin/users'
        },
        {
          label: 'Settings',
          icon: 'i-lucide-settings-2',
          to: '/admin/settings'
        }
      ]
    })
  }

  return menu
})
</script>

<style></style>
