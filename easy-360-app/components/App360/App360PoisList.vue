<template>
  <UDashboardSidebarLinks :links="links" />
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { usePOIs } from "~/composables/usePOIs";

const { selectedPOIId, editPanelState } = useEditorState();
const { pois } = usePOIs();

const items = computed(() => {
  if (!pois.value) return [];
  return pois.value.map((poi) => {
    return {
      label: poi.name,
      chip: "green",
      badge: poi.linked_scene_id ? "Linked" : "",
      active: selectedPOIId.value === poi.id,
      click: () => {
        selectedPOIId.value = poi.id;
        editPanelState.value = "poi";
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
