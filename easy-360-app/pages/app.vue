<template>
  <ClientOnly>
    <UDashboardPanel>
      <NuxtPage />
    </UDashboardPanel>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
});
</script>

<style scoped></style>
