<template>
  <UDashboardSidebarLinks :links="links" />
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { usePOIs } from "~/composables/usePOIs";

const { selectedPOIId } = useEditorState();
const { pois } = usePOIs();

const items = computed(() => {
  if (!pois.value) return [];
  return pois.value.map((poi) => {
    return {
      label: poi.name,
      chip: "green",
      active: selectedPOIId.value === poi.id,
      click: () => {
        selectedPOIId.value = poi.id;
      },
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
