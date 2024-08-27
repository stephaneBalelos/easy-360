<template>
  <UDashboardSidebarLinks :links="links" />
</template>

<script setup lang="ts">
import { usePOIs } from "~/composables/usePOIs";

const { pois } = usePOIs();

const items = computed(() => {
  return pois.value.map((poi) => {
    return {
      label: poi.name,
      chip: "green",
    };
  });
});

const links = computed(() => [{
  label: "Points of Interest",
  // draggable: true,
  children: items.value,
}])
</script>

<style scoped></style>
