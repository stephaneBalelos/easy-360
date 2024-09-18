<template>
  <ClientOnly>
    <UContainer class="w-full">
      <NuxtPage />
    </UContainer>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
});
</script>

<style scoped></style>
