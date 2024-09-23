<template>
  <USelectMenu
    v-model="currentBreakpoint"
    icon="i-heroicons-check-circle"
    placeholder="Status"
    :options="breakpoints"
    :ui-menu="{ option: { base: 'capitalize' } }"
  />
</template>

<script setup lang="ts">
const { breakpoints, currentBreakpoint } = useEditorBreakpoints();
</script>

<style scoped></style>
