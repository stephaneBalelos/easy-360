<template>
  <div v-if="status === 'success'">
    <UDashboardSidebarLinks :links="links" />
    <UButton size="xs" variant="ghost" block @click="AddNewScene"
      >Add New Scene</UButton
    >
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
    description="Error fetching scenes"
    :actions="[{ label: 'Retry', click: () => refresh(), variant: 'solid', color: 'red' }]"
  />
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { useScenes } from "~/composables/useScenes";
import { projectKey, sceneKey } from "~/constants";

const { createScene } = useScenes();
const editorState = useEditorState();
const client = useSupabaseClient();

const { data: scenes, error, status, refresh } = useAsyncData(`${projectKey}/${sceneKey}`, async () => {
  if (!editorState.selectedProjectId.value) return null;
  const { data, error } = await client.from(sceneKey).select('*')
    .eq('project_id', editorState.selectedProjectId.value)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
}, {
  lazy: true,
  watch: [editorState.selectedProjectId, editorState.selectedSceneId],
});

const items = computed(() => {
  if (!scenes.value) return [];
  return scenes.value.map((scene) => {
    const isCurrentScene = editorState.selectedSceneId.value === scene.id;
    return {
      label: scene.name,
      chip: "green",
      active: isCurrentScene,
      click: () => {
        editorState.selectedSceneId.value = scene.id;
        editorState.editPanelState.value = "scene";
        if (isCurrentScene) {
          editorState.selectedPOIId.value = null;
        }
      },
    };
  });
});

const links = computed(() => [
  {
    label: "Scenes",
    // draggable: true,
    children: items.value,
  },
]);

async function AddNewScene() {
  try {
    const res = await createScene({
      name: "New Scene",
      description: "New Scene Description",
    });
    refresh();
  } catch (error) {
    console.log("Error creating scene", error);
  }
}
</script>

<style scoped></style>
