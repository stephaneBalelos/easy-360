<template>
  <div v-if="!scenes.loading">
    <UDashboardSidebarLinks :links="links" />
    <UButton size="xs" variant="ghost" block @click="AddNewScene"
      >Add New Scene</UButton
    >
  </div>
  <div v-else-if="scenes.loading">
    <USkeleton class="h-8 w-full mb-2" />
    <USkeleton class="h-6 w-full mb-1" />
    <USkeleton class="h-6 w-full mb-1" />
    <USkeleton class="h-6 w-full mb-1" />
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { useScenes } from "~/composables/useScenes";
import { projectFilesBucketId, projectKey, sceneKey } from "~/constants";
import { useImage } from '@vueuse/core'


const { createScene } = useScenes();
const editorState = useEditorState();
const client = useSupabaseClient();
const { scenes, getSceneFileUrlPublic } = useScenes();

const items = computedAsync(async () => {
  if (!scenes.items) return [];
  return await Promise.all(scenes.items
    .filter((scene) => {
      return scene.data.project_id === editorState.selectedProjectId.value;
    })
    .map(async (scene) => {
      const isCurrentScene =
        editorState.selectedSceneId.value === scene.data.id;
        const filePath = getSceneFileUrlPublic(scene.data.project_id, scene.data.id);
      const {error} = await useImage({src: filePath});
      return {
        label: scene.data.name,
        chip: error.value ? "red" : "green",
        active: isCurrentScene,
        click: () => {
          editorState.selectedSceneId.value = scene.data.id;
          editorState.editPanelState.value = "scene";
          if (isCurrentScene) {
            editorState.selectedPOIId.value = null;
          }
        },
      };
    }));
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
  } catch (error) {
    console.log("Error creating scene", error);
  }
}
</script>

<style scoped></style>
