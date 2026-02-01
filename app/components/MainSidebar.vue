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
      <LanguageSwitcher v-if="!collapsed" class="mb-2" />
      <p v-if="!collapsed" class="text-sm text-muted">
        {{ $t('common.copyrightFull', { year: new Date().getFullYear() }) }}
      </p>
      <p v-else class="text-sm text-muted">
        {{ $t('common.copyright', { year: new Date().getFullYear() }) }}
      </p>
    </template>
  </UDashboardSidebar>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const { isAdmin } = useRole()

const items = computed(() => {
  const menu: NavigationMenuItem[] = [
    {
      label: t('nav.dashboard'),
      icon: 'i-lucide-house',
      to: '/dashboard'
    },
    {
      label: t('nav.billing'),
      icon: 'i-lucide-credit-card',
      to: '/billing'
    },
    {
      label: t('nav.settings'),
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
      label: t('nav.admin'),

      icon: 'i-lucide-shield-check',
      defaultOpen: true,
      children: [
        {
          label: t('nav.users'),
          icon: 'i-lucide-users',
          to: '/admin/users'
        },
        {
          label: t('nav.settings'),
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
