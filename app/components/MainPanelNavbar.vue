<template>
  <UDashboardNavbar :title="title">
    <template #leading>
      <UDashboardSidebarCollapse />
    </template>
    <template #right>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </template>
  </UDashboardNavbar>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string;
}>();
</script>
