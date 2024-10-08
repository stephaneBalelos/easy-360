<template>
  <div v-if="!pois.loading">
    <UDashboardSidebarLinks :links="links" />
  </div>
  <div v-else-if="pois.loading">
    <USkeleton class="h-8 w-full mb-2" />
    <USkeleton class="h-6 w-full mb-1" />
    <USkeleton class="h-6 w-full mb-1" />
    <USkeleton class="h-6 w-full mb-1" />
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { poiKey, projectKey, sceneKey } from "~/constants";

const editorState = useEditorState();
const client = useSupabaseClient();

const { pois } = usePOIs();

const items = computed(() => {
  if (!pois.items) return [];
  return pois.items.filter((poi) => {
    return poi.data.scene_id === editorState.selectedSceneId.value;
  }).map((poi) => {
    return {
      label: poi.data.name,
      chip: "green",
      badge: poi.data.linked_scene_id ? "Linked" : "",
      active: editorState.selectedPOIId.value === poi.data.id,
      click: () => {
        editorState.selectedPOIId.value = poi.data.id;
        editorState.editPanelState.value = "poi";
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
