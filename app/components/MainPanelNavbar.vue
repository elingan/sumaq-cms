<template>
  <UDashboardNavbar :title="title">
    <template #leading>
      <UDashboardSidebarCollapse />
    </template>
    <template #right>
      <SignedIn>
        <UserButton
          user-profile-mode="navigation"
          user-profile-url="/profile"
        />
      </SignedIn>
    </template>
  </UDashboardNavbar>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string;
}>();
</script>
