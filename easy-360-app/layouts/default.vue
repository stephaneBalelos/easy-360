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
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(), { default: () => [] })

provide('navigation', navigation)
</script>

<style scoped></style>
