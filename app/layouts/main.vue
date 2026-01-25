<template>
  <UDashboardGroup>
    <MainSidebar />
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
// const route = useRoute();

// const pageTitle = computed(() => {
//   if (!route.name) return "";

//   // Convert route name like 'main-dashboard' to 'Dashboard'
//   const name = String(route.name);
//   const parts = name.split("-");
//   const lastPart = parts[parts.length - 1];

//   if (!lastPart) return "";

//   // Capitalize first letter
//   return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
// });
</script>
