<template>
  <div v-if="status === 'success'">
    <UDashboardSidebarLinks :links="links" />
  </div>
  <div v-else-if="status === 'pending'">
    <USkeleton class="h-8 w-full mb-2" />
    <USkeleton class="h-6 w-full mb-1" />
    <USkeleton class="h-6 w-full mb-1" />
    <USkeleton class="h-6 w-full mb-1" />
  </div>
  <div v-else-if="status === 'error'">
    <UAlert
    color="red"
    variant="soft"
    title="Opps! Something went wrong"
    description="Error fetching Points of Interest"
    :actions="[{ label: 'Retry', click: () => refresh(), variant: 'solid', color: 'red' }]"
  />
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { poiKey, projectKey, sceneKey } from "~/constants";

const editorState = useEditorState();
const client = useSupabaseClient();

const { data: pois, error, status, refresh } = useAsyncData(`${projectKey}/${sceneKey}/${poiKey}`, async () => {
  if (!editorState.selectedSceneId.value) return null;
  const { data, error } = await client.from(poiKey).select("id, name, linked_scene_id")
    .eq('scene_id', editorState.selectedSceneId.value)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
}, {
  lazy: true,
  watch: [editorState.selectedSceneId],
});

const items = computed(() => {
  if (!pois.value) return [];
  return pois.value.map((poi) => {
    return {
      label: poi.name,
      chip: "green",
      badge: poi.linked_scene_id ? "Linked" : "",
      active: editorState.selectedPOIId.value === poi.id,
      click: () => {
        editorState.selectedPOIId.value = poi.id;
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
