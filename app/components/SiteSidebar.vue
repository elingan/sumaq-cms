<template>
  <UDashboardSidebar collapsible>
    <template #header="{ collapsed }">
      <AppLogo v-if="!collapsed" class="h-5 w-auto shrink-0" />
      <UIcon
        v-else
        name="i-simple-icons-nuxtdotjs"
        class="size-5 text-primary mx-auto"
      />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        :collapsed="collapsed"
      />
    </template>

    <template #footer="{ collapsed }">
      <p v-if="!collapsed" class="text-sm text-muted">
        {{ $t('common.copyrightFull', { year: new Date().getFullYear() }) }}
      </p>
      <p v-else class="text-sm text-muted">{{ $t('common.copyright', { year: new Date().getFullYear() }) }}</p>
    </template>
  </UDashboardSidebar>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

const { t } = useI18n()

// const route = useRoute();

const items: NavigationMenuItem[] = computed(() => [
  {
    label: t('nav.dashboard'),
    icon: 'i-lucide-house',
    to: '/dashboard',
  },
  {
    label: t('nav.billing'),
    icon: 'i-lucide-credit-card',
    to: '/billing',
  },
  {
    label: t('nav.settings'),
    icon: 'i-lucide-settings',
    to: '/settings',
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
  },
]);
</script>

<style></style>
