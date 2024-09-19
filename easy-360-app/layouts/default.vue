<template>
  <div>
    <AppHeader />

    <UMain>
      <slot />
    </UMain>

    <!-- <AppFooter /> -->

    <ClientOnly>
      <!-- <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      /> -->
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';
</script>

<style scoped></style>
