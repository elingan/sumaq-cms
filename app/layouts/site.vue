<template>
  <UDashboardGroup>
    <SiteSidebar />
    <UDashboardPanel>
      <template #header>
        <MainPanelNavbar :title="pageTitle" />
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script lang="ts" setup>

const route = useRoute();

const pageTitle = computed(() => {
  if (!route.name) return "title";
  return String(route.name);
});

</script>
