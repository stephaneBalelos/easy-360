<template>
  <UBadge :label="`v${public_config.app_version}`" variant="subtle" class="mb-0.5" />
</template>

<script setup lang="ts">
const { public:public_config } = useRuntimeConfig()
</script>

<style scoped></style>
